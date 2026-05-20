import type {FluentVariable} from '@fluent/bundle'
import {FluentBundle, FluentResource} from '@fluent/bundle'
import type {Pattern} from '@fluent/bundle/esm/ast'
import type {ComponentStore} from '../../../stores/ComponentStore'
import {isLocalizedProperty} from '../../../stores/ComponentStore'
import type {IForm} from '../../../stores/IForm'
import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'
import {getEditableFormData} from '../../../utils/contexts/ComponentDataContext'
import type {IFormData} from '../../../utils/IFormData'
import {isNull, isUndefined} from '../../../utils/tools'
import {getValidatorPropertyBlockType} from '../../ui/PropertyBlockType'
import {globalDefaultLanguage} from '../default'
import type {ILocalizationEngine} from '../ILocalizationEngine'
import type {Language, LanguageFullCode} from '../language'
import {LocalizationError} from '../LocalizationError'
import type {LocalizationType} from '../types'
import {dotInternalValue, replaceDots, replaceDotsDeep, restoreDots} from './dots'
import {isFluentVariable} from './isFluentVariable'

const escapeCurlyBraces = (value: string): string => {
  return value.replaceAll('{', '{"{"}').replaceAll('}', '{"}"}')
}

const fluentEncodeValue = (value: unknown): string => {
  const raw = typeof value === 'string' ? value : JSON.stringify(value)
  const escaped = typeof value === 'string' ? raw : escapeCurlyBraces(raw)
  const lines = escaped.split('\n')

  if (lines.length <= 1) return lines[0] ?? ''

  const [first, ...rest] = lines

  // https://projectfluent.org/fluent/guide/syntax.html#multiline-text
  return [
    first ?? '',
    ...rest.map((line) => `    ${line}`),
  ].join('\n')
}

const objetToFluentResource = (messages: Record<string, unknown>): string =>
  Object.entries(messages)
    .map(([key, value]) => `${key} = ${fluentEncodeValue(replaceDotsDeep(value))}`)
    .join('\n')

const convertFluentError = (error: Error): LocalizationError =>
  new LocalizationError(error.message, error.name)

const logFluentErrors = (errors: Array<LocalizationError | Error>, missing?: Array<any>, logMissing = false) => {
  errors.forEach((e) => {
    if (e.name.indexOf('Attempt to override') > -1) return
    console.warn(e)
  })

  if (logMissing && Array.isArray(missing) && missing.length > 0) {
    console.warn(missing)
  }
}

/**
 * Wrapper around FluentBundle constructor with specific settings.
 * @param langFullCode Language full code ie 'en-US'.
 * @returns the message bundles.
 */
const createFluentBundle = (langFullCode: LanguageFullCode): FluentBundle => {
  return new FluentBundle(langFullCode, {useIsolating: false})
}

/**
 * Memorizes undefined data variables and replaces them with empty string.
 * @param localizationData key-val localization data.
 * @param missingProperties array to memoize undefined variables names.
 * @returns proxy for data record.
 */
function createLocalizationDataProxy(localizationData: Record<string, any>, missingProperties: string[]) {
  return new Proxy(localizationData, {
    get(target, property: string) {
      if (property in target) {
        return target[property]
      }
      missingProperties.push(restoreDots(property))
      return ''
    },
    getOwnPropertyDescriptor(target, property) {
      if (property in target) {
        return Reflect.getOwnPropertyDescriptor(target, property)
      }
      return {
        value: '',
        writable: true,
        configurable: true,
      }
    },
  })
}

/**
 * Fluent.js implementation of {@link ILocalizationEngine}.
 */
export class FluentLocalizationEngine implements ILocalizationEngine {
  #bundles = new Map<string, FluentBundle>()
  #locale = globalDefaultLanguage.fullCode

  /**
   * Constructor.
   * @param locale the language full code, i.e. 'en-US'.
   */
  constructor(locale?: LanguageFullCode) {
    this.#locale = locale ?? this.#locale
  }

  /**
   * Creates a Fluent bundle for the given language and items.
   * @param languageFullCode the full language code (e.g., 'en-US').
   * @param items the localization items to add to the bundle.
   * @param errors the array to collect any localization errors.
   * @param bundle the fluent bundle to use.
   * @returns the created Fluent bundle.
   */
  #createFluentBundle(languageFullCode: LanguageFullCode, items: Record<string, unknown>, errors: Array<LocalizationError>, bundle?: FluentBundle): FluentBundle {
    bundle = bundle ?? this.#getBundle(languageFullCode)
    const source = objetToFluentResource(items)
    const fluentResource = new FluentResource(source)
    const fluentErrors = bundle.addResource(fluentResource)

    errors.length = 0
    fluentErrors.forEach(error => errors.push(convertFluentError(error)))
    logFluentErrors(errors)

    return bundle
  }

  /**
   * Gets or creates a Fluent bundle for the given language code.
   * @param languageFullCode the full language code (e.g., 'en-US').
   * @returns the Fluent bundle for the language.
   */
  #getBundle(languageFullCode: LanguageFullCode): FluentBundle {
    const bundle = this.#bundles.get(languageFullCode) ?? createFluentBundle(languageFullCode)
    this.#bundles.set(languageFullCode, bundle)
    return bundle
  }

  /**
   * Gets the message value from a Fluent bundle.
   * @param bundle the Fluent bundle to get the message from.
   * @param id the message ID to retrieve.
   * @returns the message value or undefined if not found.
   */
  #getMessageValue(bundle: FluentBundle, id: string): string | undefined {
    const msg = bundle.getMessage(id)
    if (!msg) {
      return undefined
    }
    return (msg.value as string | null) ?? ''
  }

  /**
   * @inheritDoc
   */
  set language(locale: LanguageFullCode) {
    this.#locale = locale
  }

  /**
   * @inheritDoc
   */
  get language(): LanguageFullCode {
    return this.#locale
  }

  /**
   * @inheritDoc
   */
  addMessages(locale: LanguageFullCode, messages: Record<string, unknown>): Array<LocalizationError> {
    const source = objetToFluentResource(messages)
    const bundle = this.#getBundle(locale)
    const resource = new FluentResource(source)
    const errors = bundle.addResource(resource, {allowOverrides: true})

    return errors.map(convertFluentError)
  }

  /**
   * @inheritDoc
   */
  localizeProperties(
    form: IForm,
    formData: IFormData,
    language: Language,
    componentStore: ComponentStore,
    type: LocalizationType = 'component'
  ) {
    const normalizedKey = this.getCompatibleId(componentStore.key)
    const messageIdPrefix = `${normalizedKey}_${type}_`
    const data = {} as Record<string, any>
    const requestedFullCode = language.fullCode
    const errors: Array<LocalizationError> = []

    const {defaultBundle, defaultItems, formBundle, formItems} = this.#setupBundles(form, requestedFullCode, errors)

    let fluentDataCache: Record<string, FluentVariable> | undefined = undefined
    const getFluentData = () => {
      if (!fluentDataCache) {
        const editableData = getEditableFormData(formData)
        const missingProperties: string[] = []
        fluentDataCache = createLocalizationDataProxy(this.#getFluentData(editableData), missingProperties)
      }
      return fluentDataCache
    }

    Object.entries(componentStore.props).forEach(([value, componentProperty]) => {
      if (!isLocalizedProperty(componentProperty)) {
        return
      }

      const rawConstant = form.localization.getLocalization(requestedFullCode, componentStore.key, value, type)
      if (!isUndefined(rawConstant) && typeof rawConstant !== 'string') {
        const bundle = formBundle ?? defaultBundle ?? createFluentBundle(requestedFullCode)
        data[value] = this.#interpolateData(rawConstant, bundle, getFluentData())
        return
      }

      const messageId = `${messageIdPrefix}${this.getCompatibleId(value)}`
      const jsonFromLocalization = this.#tryParseJsonLocalization(messageId, formItems, defaultItems)
      if (!isUndefined(jsonFromLocalization)) {
        const bundle = formBundle ?? defaultBundle ?? createFluentBundle(requestedFullCode)
        data[value] = this.#interpolateData(jsonFromLocalization, bundle, getFluentData())
        return
      }

      const localizedMessage = this.#getMessageWithFallback(messageId, formBundle, defaultBundle, formItems, defaultItems)
      data[value] = this.#resolveLocalizedPropertyValue(localizedMessage, value, form, componentStore, formData)
    })

    return data
  }

  /**
   * @inheritDoc
   */
  getCompatibleId(rawId: string): string {
    return rawId.replace(/\s/g, '_')
  }

  /**
   * @inheritDoc
   */
  localizeErrorMessage(
    form: IForm,
    formData: ComponentData,
    language: Language,
    componentStore: ComponentStore,
    ruleKey: string
  ) {
    const type = getValidatorPropertyBlockType(ruleKey)
    const normalizedKey = this.getCompatibleId(componentStore.key)
    const messageId = `${normalizedKey}_${type}_message`
    const errors: Array<LocalizationError> = []

    const {defaultBundle, defaultItems, formBundle, formItems} = this.#setupBundles(form, language.fullCode, errors)
    const localizedMessage = this.#getMessageWithFallback(messageId, formBundle, defaultBundle, formItems, defaultItems)

    return localizedMessage ? this.#formatMessage(localizedMessage.message, localizedMessage.bundle, formData) : undefined
  }

  /**
   * @inheritDoc
   */
  testLocalization(localization: string,
                   localizationStringId: string,
                   language: Language,
                   formData: IFormData) {
    const errors: Array<LocalizationError> = []
    const languageFullCode = language.fullCode

    const testBundle = this.#createFluentBundle(languageFullCode, {
      [`${localizationStringId}`]: localization
    }, errors, createFluentBundle(languageFullCode))

    const msg = testBundle.getMessage(localizationStringId)
    const value = msg?.value ?? ''

    const formatErrors: Error[] = []
    const data = getEditableFormData(formData)
    const missingProperties: string[] = []
    const fluentData = createLocalizationDataProxy(this.#getFluentData(data), missingProperties)
    const result = restoreDots(testBundle.formatPattern(value, fluentData, formatErrors))

    // Log missing properties only in testLocalization
    logFluentErrors(formatErrors, missingProperties, true)

    return formatErrors.length > 0
      ? formatErrors.map(err => new LocalizationError('MessageFormatError', err.message))
      : result
  }

  /**
   * Sets up bundles for default and requested languages.
   * @param form the form containing localization data.
   * @param requestedFullCode the requested language full code.
   * @param errors the array to collect any localization errors.
   * @returns the object containing default and form bundles.
   */
  #setupBundles(
    form: IForm,
    requestedFullCode: LanguageFullCode,
    errors: Array<LocalizationError>
  ): {
    defaultBundle?: FluentBundle;
    defaultItems?: Record<string, unknown>;
    formBundle?: FluentBundle;
    formItems?: Record<string, unknown>
  } {
    const defaultFullCode = form.defaultLanguage.fullCode
    const defaultItemsRaw = defaultFullCode !== requestedFullCode
      ? form.localization.getItems(defaultFullCode)
      : undefined
    const formItemsRaw = form.localization.getItems(requestedFullCode)
    const defaultItems = defaultItemsRaw ?? undefined
    const formItems = formItemsRaw ?? undefined

    // TODO FE-2002 hotfix
    const defaultBundle = defaultItems
      ? this.#createFluentBundle(defaultFullCode, defaultItems, errors, createFluentBundle(defaultFullCode))
      : undefined
    const formBundle = formItems
      ? this.#createFluentBundle(requestedFullCode, formItems, errors, createFluentBundle(requestedFullCode))
      : undefined

    return {defaultBundle, defaultItems, formBundle, formItems}
  }

  /**
   * Returns true when the localization map explicitly stores an empty string for the message id.
   * @param items localization key to fluent source map.
   * @param messageId fluent message id.
   * @returns true when the entry exists and is the empty string.
   */
  #hasExplicitEmptyLocalization(items: Record<string, unknown> | undefined, messageId: string): boolean {
    return !!items
      && Object.prototype.hasOwnProperty.call(items, messageId)
      && typeof items[messageId] === 'string'
      && items[messageId] === ''
  }

  /**
   * Builds a resolved empty-string message, preferring the given bundle for formatting context.
   * @param preferredBundle bundle to attach when present.
   * @returns empty message with bundle for downstream formatting.
   */
  #resolvedEmptyMessage(preferredBundle?: FluentBundle): { message: string; bundle: FluentBundle } {
    return {
      message: '',
      bundle: preferredBundle ?? createFluentBundle(this.#locale),
    }
  }

  /**
   * Retrieves a message from bundles with fallback support.
   * @param messageId the message ID to retrieve.
   * @param formBundle the primary form bundle.
   * @param defaultBundle the fallback default bundle.
   * @param formItems the localization items for the requested language.
   * @param defaultItems the localization items for the default language.
   * @returns the message value or undefined if not found.
   */
  #getMessageWithFallback(
    messageId: string,
    formBundle?: FluentBundle,
    defaultBundle?: FluentBundle,
    formItems?: Record<string, unknown>,
    defaultItems?: Record<string, unknown>
  ): { message: string; bundle: FluentBundle } | undefined {
    if (this.#hasExplicitEmptyLocalization(formItems, messageId)) {
      return this.#resolvedEmptyMessage(formBundle)
    }

    if (formBundle) {
      const fromRequestedLocale = this.#getMessageValue(formBundle, messageId)
      if (!isUndefined(fromRequestedLocale)) {
        return {message: fromRequestedLocale, bundle: formBundle}
      }
    }

    if (this.#hasExplicitEmptyLocalization(defaultItems, messageId)) {
      return this.#resolvedEmptyMessage(defaultBundle)
    }

    if (defaultBundle) {
      const fromDefaultLocale = this.#getMessageValue(defaultBundle, messageId)
      if (!isUndefined(fromDefaultLocale)) {
        return {message: fromDefaultLocale, bundle: defaultBundle}
      }
    }

    return undefined
  }

  /**
   * Formats a message with form data and handles errors.
   * @param message the message to format.
   * @param bundle the bundle to use for formatting.
   * @param formData the form data for variable substitution.
   * @returns the formatted result or undefined.
   */
  #formatMessage(message: Pattern, bundle: FluentBundle | undefined, formData: IFormData): string | undefined {
    const errors: Error[] = []
    const data = getEditableFormData(formData)
    const missingProperties: string[] = []
    const fluentData = createLocalizationDataProxy(this.#getFluentData(data), missingProperties)
    const result = bundle?.formatPattern(message, fluentData, errors)

    logFluentErrors(errors, missingProperties)

    return isUndefined(result) ? undefined : restoreDots(result)
  }

  /**
   * Resolves the localized component property value.
   * @param localizedMessage localized message and source bundle.
   * @param propertyKey component property key.
   * @param form the form instance.
   * @param componentStore the component store.
   * @param formData current form data.
   * @returns the resolved value.
   */
  #resolveLocalizedPropertyValue(
    localizedMessage: { message: string; bundle: FluentBundle } | undefined,
    propertyKey: string,
    form: IForm,
    componentStore: ComponentStore,
    formData: IFormData
  ): string | undefined {
    if (localizedMessage) {
      const result = this.#formatMessage(localizedMessage.message, localizedMessage.bundle, formData)
      const isWhitespaceOnlySource = typeof localizedMessage.message === 'string'
        && localizedMessage.message !== ''
        && localizedMessage.message.trim() === ''
      if (isWhitespaceOnlySource && result === '') {
        // Fluent trims whitespace-only messages. Use regular fallback chain for this case.
      } else {
        return result
      }
    }

    const propValue = componentStore.props[propertyKey]?.value
    if (!isUndefined(propValue)) return propValue

    const defaultPropertyValue = (form as any).componentTree
      ?.findByKey(componentStore.key)
      ?.model
      ?.defaultProps?.[propertyKey]
    if (!isUndefined(defaultPropertyValue)) return defaultPropertyValue

    return componentStore.type
  }

  #tryParseJsonLocalization(
    messageId: string,
    formItems?: Record<string, unknown>,
    defaultItems?: Record<string, unknown>
  ): unknown {
    const fromRequested = formItems?.[messageId]
    const requestedParsed = this.#tryParseJsonUnknown(fromRequested)
    if (!isUndefined(requestedParsed)) return requestedParsed

    const fromDefault = defaultItems?.[messageId]
    return this.#tryParseJsonUnknown(fromDefault)
  }

  #tryParseJsonUnknown(value: unknown): unknown {
    if (isUndefined(value)) return undefined
    if (typeof value !== 'string') return value
    const trimmed = value.trim()
    if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) return undefined
    try {
      return JSON.parse(trimmed)
    } catch {
      return undefined
    }
  }

  /**
   * Interpolates a single string through a temporary Fluent bundle.
   * @param value the string potentially containing Fluent placeholders.
   * @param bundle the Fluent bundle to use for formatting context.
   * @param fluentData the flattened form data for variable substitution.
   * @returns the interpolated string, or the original string if it contains no placeholders.
   */
  #interpolateString(value: string, bundle: FluentBundle, fluentData: Record<string, FluentVariable>): string {
    if (!value.includes('{')) return value

    const tempId = 'interpolate-tmp'
    const dottedValue = replaceDots(value)
    const tempBundle = createFluentBundle(bundle.locales[0] as LanguageFullCode)
    const resource = new FluentResource(`${tempId} = ${fluentEncodeValue(dottedValue)}`)
    tempBundle.addResource(resource)

    const msg = tempBundle.getMessage(tempId)
    if (!msg?.value) return value

    const errors: Error[] = []
    const result = tempBundle.formatPattern(msg.value, fluentData, errors)
    return restoreDots(result)
  }

  /**
   * Recursively traverses data of any shape and interpolates Fluent placeholders in string keys and values.
   * @param data the data to interpolate (can be any shape: primitive, array, or object).
   * @param bundle the Fluent bundle to use for formatting context.
   * @param fluentData the flattened form data for variable substitution.
   * @returns the data with all string keys and values interpolated.
   */
  #interpolateData(data: unknown, bundle: FluentBundle, fluentData: Record<string, FluentVariable>): unknown {
    if (typeof data === 'string') {
      return this.#interpolateString(data, bundle, fluentData)
    }

    if (Array.isArray(data)) {
      return data.map((item) => this.#interpolateData(item, bundle, fluentData))
    }

    if (typeof data === 'object' && !isNull(data)) {
      const result: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        const interpolatedKey = this.#interpolateString(key, bundle, fluentData)
        result[interpolatedKey] = this.#interpolateData(value, bundle, fluentData)
      }
      return result
    }

    return data
  }

  /**
   * Converts the form data to a Fluent compatible. **Internal use only.**
   * @param data the form data.
   * @param parentKey the parent property key.
   * @returns all the form data that is of the FluentVariable type.
   * Additionally, the keys of the returned object are converted to the snake case.
   */
  #getFluentData = (data: Record<string, unknown>, parentKey = ''): Record<string, FluentVariable> => {
    const fluentData: Record<string, FluentVariable> = {}

    for (const [key, value] of Object.entries(data)) {
      const newKey = parentKey ? `${parentKey}${dotInternalValue}${key}` : key

      if (isFluentVariable(value)) {
        fluentData[this.getCompatibleId(newKey)] = value
      } else if (typeof value === 'boolean') {
        fluentData[this.getCompatibleId(newKey)] = value ? 'true' : 'false'
      } else if (typeof value === 'object' && !isNull(value)) {
        Object.assign(fluentData, this.#getFluentData(value as Record<string, unknown>, newKey))
      }
    }
    return fluentData
  }

}
