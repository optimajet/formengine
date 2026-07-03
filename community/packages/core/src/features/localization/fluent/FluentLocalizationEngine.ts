import type {FluentBundle, FluentVariable} from '@fluent/bundle'
import {FluentResource} from '@fluent/bundle'
import type {Pattern} from '@fluent/bundle/esm/ast'
import type {ComponentStore} from '../../../stores/ComponentStore'
import {isLocalizedProperty} from '../../../stores/ComponentStore'
import type {Form} from '../../../stores/Form'
import type {IForm} from '../../../stores/IForm'
import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'
import {getEditableFormData} from '../../../utils/contexts/ComponentDataContext'
import type {IFormData} from '../../../utils/IFormData'
import {isString} from '../../../utils/isString'
import {isBoolean, isNull, isUndefined} from '../../../utils/tools'
import {getValidatorPropertyBlockType} from '../../ui/PropertyBlockType'
import {globalDefaultLanguage} from '../default'
import type {ILocalizationEngine} from '../ILocalizationEngine'
import type {Language, LanguageFullCode} from '../language'
import {LocalizationError} from '../LocalizationError'
import type {LocalizationType} from '../types'
import type {ComponentLocalizationContext, LocalizationBundleSetup} from './componentLocalizationContext'
import {createFluentBundle} from './createFluentBundle'
import {dotInternalValue, replaceDots, restoreDots} from './dots'
import {FluentBundleCache, populateFluentBundle, setupLocalizationBundles} from './fluentBundleSetup'
import {logFluentErrors} from './fluentErrors'
import type {ResolvedMessage} from './fluentMessageResolution'
import {getMessageWithFallback, resolveLocalizedMessageValue} from './fluentMessageResolution'
import {fluentEncodeValue} from './fluentResource'
import {isFluentVariable} from './isFluentVariable'
import {createLocalizationDataProxy} from './localizationDataProxy'

const INTERPOLATE_TEMP_MESSAGE_ID = 'interpolate-tmp'

/**
 * Fluent.js implementation of {@link ILocalizationEngine}.
 */
export class FluentLocalizationEngine implements ILocalizationEngine {
  readonly #bundleCache = new FluentBundleCache()
  #locale = globalDefaultLanguage.fullCode

  /**
   * Constructor.
   * @param locale the language full code, i.e. 'en-US'.
   */
  constructor(locale?: LanguageFullCode) {
    this.#locale = locale ?? this.#locale
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
    return this.#bundleCache.addMessages(locale, messages, {allowOverrides: true})
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
    const data = {} as Record<string, unknown>
    const errors: Array<LocalizationError> = []
    const bundleSetup = setupLocalizationBundles(form, language.fullCode, errors)
    const context = this.#createComponentLocalizationContext(
      form,
      formData,
      componentStore,
      type,
      language.fullCode,
      bundleSetup
    )

    Object.entries(componentStore.props).forEach(([propertyKey, componentProperty]) => {
      if (!isLocalizedProperty(componentProperty)) {
        return
      }

      data[propertyKey] = this.#resolveLocalizedProperty(propertyKey, context)
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

    const {defaultBundle, defaultItems, formBundle, formItems} = setupLocalizationBundles(form, language.fullCode, errors)
    const localizedMessage = getMessageWithFallback(messageId, formBundle, defaultBundle, formItems, defaultItems)

    return localizedMessage
      ? this.#formatPattern(localizedMessage.message, localizedMessage.bundle, formData)
      : undefined
  }

  /**
   * @inheritDoc
   */
  testLocalization(
    localization: string,
    localizationStringId: string,
    language: Language,
    formData: IFormData
  ) {
    const errors: Array<LocalizationError> = []
    const languageFullCode = language.fullCode

    const testBundle = populateFluentBundle(
      {[localizationStringId]: localization},
      errors,
      createFluentBundle(languageFullCode),
    )

    const msg = testBundle.getMessage(localizationStringId)
    const value = msg?.value ?? ''

    const formatErrors: Error[] = []
    const {fluentData, missingProperties} = this.#buildFluentDataProxy(formData)
    const result = restoreDots(testBundle.formatPattern(value, fluentData, formatErrors))

    logFluentErrors(formatErrors, missingProperties, true)

    return formatErrors.length > 0
      ? formatErrors.map((err) => new LocalizationError('MessageFormatError', err.message))
      : result
  }

  /**
   * Formats a message pattern with form data.
   * @param message the message to format.
   * @param bundle the bundle to use for formatting.
   * @param formData the form data for variable substitution.
   * @param options formatting options.
   * @param options.logMissing when true, logs missing property names used in placeholders.
   * @returns the formatted result or undefined.
   */
  #formatPattern(
    message: Pattern | string,
    bundle: FluentBundle | undefined,
    formData: IFormData,
    options?: { logMissing?: boolean },
  ): string | undefined {
    const formatErrors: Error[] = []
    const {fluentData, missingProperties} = this.#buildFluentDataProxy(formData)
    const result = bundle?.formatPattern(message, fluentData, formatErrors)

    logFluentErrors(formatErrors, missingProperties, options?.logMissing)

    return isUndefined(result) ? undefined : restoreDots(result)
  }

  /**
   * Builds fluent data proxy for the given form data.
   * @param formData form data.
   * @returns fluent data proxy and missing property collector.
   */
  #buildFluentDataProxy(formData: IFormData): {
    fluentData: Record<string, FluentVariable>;
    missingProperties: string[];
  } {
    const data = getEditableFormData(formData)
    const missingProperties: string[] = []
    const fluentData = createLocalizationDataProxy(
      this.#getFluentData(data),
      missingProperties,
    ) as Record<string, FluentVariable>
    return {fluentData, missingProperties}
  }

  /**
   * Returns a lazy getter for fluent interpolation data.
   * @param formData form data.
   * @returns getter for fluent data proxy.
   */
  #createLazyFluentDataGetter(formData: IFormData): () => Record<string, FluentVariable> {
    let fluentDataCache: Record<string, FluentVariable> | undefined = undefined

    return () => {
      fluentDataCache ??= this.#buildFluentDataProxy(formData).fluentData
      return fluentDataCache
    }
  }

  /**
   * Builds shared context for localizing all properties of one component.
   * @param form the form instance.
   * @param formData current form data.
   * @param componentStore the component store.
   * @param type localization type.
   * @param requestedFullCode requested language full code.
   * @param bundleSetup prepared fluent bundles and item maps.
   * @returns component localization context.
   */
  #createComponentLocalizationContext(
    form: IForm,
    formData: IFormData,
    componentStore: ComponentStore,
    type: LocalizationType,
    requestedFullCode: LanguageFullCode,
    bundleSetup: LocalizationBundleSetup,
  ): ComponentLocalizationContext {
    const normalizedKey = this.getCompatibleId(componentStore.key)
    return {
      form,
      formData,
      componentStore,
      type,
      requestedFullCode,
      messageIdPrefix: `${normalizedKey}_${type}_`,
      getFluentData: this.#createLazyFluentDataGetter(formData),
      ...bundleSetup,
    }
  }

  /**
   * Returns the bundle used for interpolation when form bundles are unavailable.
   * @param context component localization context.
   * @returns bundle for interpolation.
   */
  #formattingBundle(context: Pick<ComponentLocalizationContext, 'requestedFullCode' | 'formBundle' | 'defaultBundle'>): FluentBundle {
    return context.formBundle ?? context.defaultBundle ?? createFluentBundle(context.requestedFullCode)
  }

  /**
   * Resolves one localized component property.
   * @param propertyKey component property key.
   * @param context shared localization context for the component.
   * @returns resolved property value.
   */
  #resolveLocalizedProperty(propertyKey: string, context: ComponentLocalizationContext): unknown {
    const {
      form,
      formData,
      componentStore,
      type,
      requestedFullCode,
      messageIdPrefix,
      formBundle,
      defaultBundle,
      formItems,
      defaultItems,
      getFluentData,
    } = context

    const rawConstant = form.localization.getLocalization(
      requestedFullCode,
      componentStore.key,
      propertyKey,
      type,
    )

    if (!isUndefined(rawConstant) && !isString(rawConstant)) {
      return this.#interpolateData(rawConstant, this.#formattingBundle(context), getFluentData())
    }

    const messageId = `${messageIdPrefix}${this.getCompatibleId(propertyKey)}`
    const jsonFromLocalization = this.#tryParseJsonLocalization(messageId, formItems, defaultItems)
    if (!isUndefined(jsonFromLocalization)) {
      return this.#interpolateData(jsonFromLocalization, this.#formattingBundle(context), getFluentData())
    }

    const localizedMessage = getMessageWithFallback(messageId, formBundle, defaultBundle, formItems, defaultItems)
    return this.#resolveLocalizedPropertyValue(localizedMessage, propertyKey, form, componentStore, formData)
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
    localizedMessage: ResolvedMessage | undefined,
    propertyKey: string,
    form: IForm,
    componentStore: ComponentStore,
    formData: IFormData,
  ): string | undefined {
    return resolveLocalizedMessageValue(
      localizedMessage,
      (message, bundle) => this.#formatPattern(message, bundle, formData),
      () => {
        const propValue = componentStore.props[propertyKey]?.value
        if (!isUndefined(propValue)) return propValue as string | undefined

        const defaultPropertyValue = (form as Form).componentTree
          ?.findByKey(componentStore.key)
          ?.model
          ?.defaultProps?.[propertyKey]
        if (!isUndefined(defaultPropertyValue)) {
          return defaultPropertyValue as string | undefined
        }

        return componentStore.type
      },
    )
  }

  #tryParseJsonLocalization(
    messageId: string,
    formItems?: Record<string, unknown>,
    defaultItems?: Record<string, unknown>,
  ): unknown {
    const fromRequested = formItems?.[messageId]
    const requestedParsed = this.#tryParseJsonUnknown(fromRequested)
    if (!isUndefined(requestedParsed)) return requestedParsed

    const fromDefault = defaultItems?.[messageId]
    return this.#tryParseJsonUnknown(fromDefault)
  }

  #tryParseJsonUnknown(value: unknown): unknown {
    if (isUndefined(value)) return undefined
    if (!isString(value)) return value
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

    const dottedValue = replaceDots(value)
    const tempBundle = createFluentBundle(bundle.locales[0] as LanguageFullCode)
    const resource = new FluentResource(`${INTERPOLATE_TEMP_MESSAGE_ID} = ${fluentEncodeValue(dottedValue)}`)
    tempBundle.addResource(resource)

    const msg = tempBundle.getMessage(INTERPOLATE_TEMP_MESSAGE_ID)
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
    if (isString(data)) {
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
      } else if (isBoolean(value)) {
        fluentData[this.getCompatibleId(newKey)] = value ? 'true' : 'false'
      } else if (typeof value === 'object' && !isNull(value)) {
        Object.assign(fluentData, this.#getFluentData(value as Record<string, unknown>, newKey))
      }
    }
    return fluentData
  }

}
