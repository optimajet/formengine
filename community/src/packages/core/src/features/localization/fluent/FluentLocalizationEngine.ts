import type {FluentVariable} from '@fluent/bundle'
import {FluentBundle, FluentResource} from '@fluent/bundle'
import type {Pattern} from '@fluent/bundle/esm/ast'
import type {ComponentStore} from '../../../stores/ComponentStore'
import {isLocalizedProperty} from '../../../stores/ComponentStore'
import type {IForm} from '../../../stores/IForm'
import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'
import {getEditableFormData} from '../../../utils/contexts/ComponentDataContext'
import type {IFormData} from '../../../utils/IFormData'
import {isNull} from '../../../utils/tools'
import {getValidatorPropertyBlockType} from '../../ui/PropertyBlockType'
import {globalDefaultLanguage} from '../default'
import type {ILocalizationEngine} from '../ILocalizationEngine'
import type {Language, LanguageFullCode} from '../language'
import {LocalizationError} from '../LocalizationError'
import type {LocalizationType} from '../types'
import {dotInternalValue, replaceDots, restoreDots} from './dots'
import {isFluentVariable} from './isFluentVariable'

const objetToFluentResource = (messages: Record<string, string>): string =>
  Object.entries(messages).map(([key, value]) => `${key} = ${value}`).join('\n')

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
  #createFluentBundle(languageFullCode: LanguageFullCode, items: Record<string, string>, errors: Array<LocalizationError>, bundle?: FluentBundle): FluentBundle {
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

    return msg?.value as string ?? undefined
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
  addMessages(locale: LanguageFullCode, messages: Record<string, string>): Array<LocalizationError> {
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
    const messageIdPrefix = `${componentStore.key}_${type}_`
    const data = {} as Record<string, any>
    const requestedFullCode = language.fullCode
    const errors: Array<LocalizationError> = []

    const {defaultBundle, formBundle} = this.#setupBundles(form, requestedFullCode, errors)

    Object.entries(componentStore.props).forEach(([value, componentProperty]) => {
      if (!isLocalizedProperty(componentProperty)) {
        return
      }

      const messageId = `${messageIdPrefix}${value}`
      const message = this.#getMessageWithFallback(messageId, formBundle, defaultBundle)

      if (!message) {
        data[value] = '[NOT LOCALIZED]'
        return
      }

      data[value] = this.#formatMessage(message, formBundle, formData)
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
    const messageId = `${componentStore.key}_${type}_message`
    const errors: Array<LocalizationError> = []

    const {defaultBundle, formBundle} = this.#setupBundles(form, language.fullCode, errors)
    const message = this.#getMessageWithFallback(messageId, formBundle, defaultBundle)

    return message ? this.#formatMessage(message, formBundle, formData) : undefined
  }

  /**
   * @inheritDoc
   */
  testLocalization(localization: string,
                   localizationStringId: string,
                   language: Language,
                   formData: IFormData) {
    const dottedLocalization = replaceDots(localization)
    const errors: Array<LocalizationError> = []
    const languageFullCode = language.fullCode

    const testBundle = this.#createFluentBundle(languageFullCode, {
      [`${localizationStringId}`]: dottedLocalization
    }, errors, createFluentBundle(languageFullCode))

    const msg = testBundle.getMessage(localizationStringId)
    if (!msg?.value) return [new LocalizationError('MessageError', 'Incorrect format')]

    const formatErrors: Error[] = []
    const data = getEditableFormData(formData)
    const missingProperties: string[] = []
    const fluentData = createLocalizationDataProxy(this.#getFluentData(data), missingProperties)
    const result = restoreDots(testBundle.formatPattern(msg.value, fluentData, formatErrors))

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
    formBundle?: FluentBundle
  } {
    const defaultFullCode = form.defaultLanguage.fullCode
    const defaultItems = defaultFullCode !== requestedFullCode
      ? form.localization.getItems(defaultFullCode)
      : undefined
    const formItems = form.localization.getItems(requestedFullCode)

    const defaultBundle = defaultItems ? this.#createFluentBundle(defaultFullCode, defaultItems, errors) : undefined
    const formBundle = formItems ? this.#createFluentBundle(requestedFullCode, formItems, errors) : undefined

    return {defaultBundle, formBundle}
  }

  /**
   * Retrieves a message from bundles with fallback support.
   * @param messageId the message ID to retrieve.
   * @param formBundle the primary form bundle.
   * @param defaultBundle the fallback default bundle.
   * @returns the message value or undefined if not found.
   */
  #getMessageWithFallback(
    messageId: string,
    formBundle?: FluentBundle,
    defaultBundle?: FluentBundle
  ): string | undefined {
    const primary = formBundle ? this.#getMessageValue(formBundle, messageId) : undefined
    const fallback = defaultBundle ? this.#getMessageValue(defaultBundle, messageId) : undefined
    return primary ?? fallback
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

    return result ? restoreDots(result) : undefined
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
