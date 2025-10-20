import {FluentBundle, FluentResource} from '@fluent/bundle'
import type {Pattern} from '@fluent/bundle/esm/ast'
import type {FluentVariable} from '@fluent/bundle/esm/bundle'
import type {ComponentStore} from '../../stores/ComponentStore'
import {isLocalizedProperty} from '../../stores/ComponentStore'
import type {Form} from '../../stores/Form'
import type {LocalizationType} from '../../stores/LocalizationStore'
import {CalculableResult} from '../../utils/CalculableResult'
import type {IFormData} from '../../utils/IFormData'
import {isNull, isUndefined} from '../../utils/tools'
import {getValidatorPropertyBlockType} from '../ui/PropertyBlockType'
import {replaceDots, restoreDots} from './dots'
import {getFluentCompatibleId} from './getFluentCompatibleId'
import type {Language} from './types'

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

function localizeData(fluentBundle: FluentBundle, localizationData: Record<string, any>, pattern: Pattern) {
  const missingProperties: string[] = []
  const proxyFormData = createLocalizationDataProxy(localizationData, missingProperties)
  const fluentErrors: Error[] = []
  let result = fluentBundle.formatPattern(pattern, proxyFormData, fluentErrors)
  result = restoreDots(result)
  return {
    result,
    missingProperties,
    fluentErrors
  }
}

function logFluentErrors(fluentErrors: Error[]) {
  if (fluentErrors.length > 0) {
    console.warn('Localization errors:', fluentErrors)
  }
}

const getFluentBundles = (form: Form, language: Language) => {
  const defaultBundle = form.defaultLanguage !== language
    ? form.localization.getFluentBundle(form.defaultLanguage.fullCode)
    : undefined
  const fluentBundle = form.localization.getFluentBundle(language.fullCode)
  return {defaultBundle, fluentBundle}
}

/**
 * Localization testing request.
 */
export type LocalizationTestRequest = {
  /**
   * Localization value to be tested.
   */
  localization: string,
  /**
   * The identifier of the localization string.
   */
  localizationStringId: string,
  /**
   * The localization Language.
   */
  language: Language,
  /**
   * The test form data.
   */
  data: Record<string, FluentVariable>
}

/**
 * Localization testing function. **Internal use only.**
 * @param request the localization testing request.
 * @returns the localization testing result.
 */
export const testFluentLocalization = (request: LocalizationTestRequest): CalculableResult => {
  request.localization = replaceDots(request.localization)
  const localizationSting = `${request.localizationStringId} = ${request.localization}`
  const resource = new FluentResource(localizationSting)
  const bundle = new FluentBundle(`${request.language.fullCode}`)
  const errors = bundle.addResource(resource)
  if (errors.length > 0) {
    return CalculableResult.error([...errors])
  }

  const message = bundle.getMessage(request.localizationStringId)

  if (isUndefined(message)) {
    return CalculableResult.error([{message: 'Localization message not found', name: 'MessageNotFound'}])
  }

  if (isNull(message.value)) {
    return CalculableResult.error([{message: 'Localization message is null', name: 'MessageIsNull'}])
  }

  const {result, missingProperties, fluentErrors} = localizeData(bundle, request.data, message.value)

  if (fluentErrors.length > 0) {
    return CalculableResult.error(fluentErrors)
  }

  if (missingProperties.length > 0) {
    return CalculableResult.warning(`The following variable(s) are not defined: ${missingProperties.join(', ')}`)
  }

  return CalculableResult.success(result)
}

/**
 * Localizes all props of the specified component.
 * @param form the form.
 * @param formData the form data.
 * @param language the displayed language.
 * @param componentStore the full state of a localizable component.
 * @param type the localization type.
 * @returns the object containing only the localized props of the specified component.
 */
export const localizeProperties = (form: Form, formData: IFormData, language: Language,
                                   componentStore: ComponentStore, type: LocalizationType = 'component') => {
  const {defaultBundle, fluentBundle} = getFluentBundles(form, language)
  const data: Record<string, any> = {}

  Object.keys(componentStore.props).forEach(value => {
    const componentProperty = componentStore.props[value]
    if (!isLocalizedProperty(componentProperty)) return

    const messageId = getFluentCompatibleId(`${componentStore.key}_${type}_${value}`)
    const message = fluentBundle.getMessage(messageId) ?? defaultBundle?.getMessage(messageId)
    if (!message) {
      data[value] = '[NOT LOCALIZED]'
      return
    }
    const {result, fluentErrors} = localizeData(fluentBundle, formData.fluentData, message.value!)
    data[value] = result
    logFluentErrors(fluentErrors)
  })

  return data
}

/**
 * Localizes a validator error message.
 * @param form the form.
 * @param formData the form data.
 * @param language the displayed language.
 * @param componentStore the full state of a localizable component.
 * @param ruleKey the validator rule key.
 * @returns the object containing only the localized props of the specified component.
 */
export const localizeErrorMessage = (form: Form, formData: IFormData, language: Language,
                                     componentStore: ComponentStore, ruleKey: string) => {
  const type = getValidatorPropertyBlockType(ruleKey)
  const value = 'message'
  const messageId = getFluentCompatibleId(`${componentStore.key}_${type}_${value}`)
  const {defaultBundle, fluentBundle} = getFluentBundles(form, language)
  const message = fluentBundle.getMessage(messageId) ?? defaultBundle?.getMessage(messageId)
  if (!message) {
    return
  }
  const {result, fluentErrors} = localizeData(fluentBundle, formData.fluentData, message.value!)
  logFluentErrors(fluentErrors)
  return result
}
