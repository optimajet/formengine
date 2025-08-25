import {FluentBundle, FluentResource} from '@fluent/bundle'
import {makeAutoObservable} from 'mobx'
import {replaceDots} from '../features/localization/dots'
import {getFluentCompatibleId} from '../features/localization/getFluentCompatibleId'
import type {LanguageFullCode} from '../features/localization/types'
import {nameObservable} from '../utils/observableNaming'

/**
 * The format in which localization is stored.
 * @example
 * {
 *  "en-US" :
 *  {
 *    "componentKey:
 *      {
 *        "property" : "This {$value} is localized!"
 *      }
 *  }
 * }
 */
export type LocalizationValue = Record<LanguageFullCode, ComponentsLocalization>

/**
 * A record containing localizations grouped by component key.
 */
export type ComponentsLocalization = Record<ComponentKey, TypedLocalization>

/**
 * A record containing localizations grouped by localization type.
 */
export type TypedLocalization = Partial<Record<LocalizationType, ComponentPropsLocalization>>

/**
 * A record containing localizations for the component properties.
 */
export type ComponentPropsLocalization = Record<ComponentPropertyName, string>

/**
 * The component key.
 */
export type ComponentKey = string

/**
 * The component property name.
 */
export type ComponentPropertyName = string

const className = 'LocalizationStore'

/**
 * Represents the type of localization. The localization can be for a component, tooltip or for validator.
 */
export type LocalizationType = 'component' | 'tooltip' | 'modal' | string

class FluentBundleHolder {

  constructor(readonly languageFullCode: LanguageFullCode,
              readonly localizationStore: LocalizationStore) {
    makeAutoObservable(this, undefined, {name: nameObservable('FluentBundleHolder')})
  }

  get fluentBundle() {
    const componentsLocalization = this.localizationStore.value[this.languageFullCode]
    const bundle = new FluentBundle(this.languageFullCode)

    if (componentsLocalization) {
      const localizationItems = this.#getLocalizationItems(componentsLocalization)
      localizationItems.forEach(item => {
        const errors = bundle.addResource(new FluentResource(item))
        if (errors.length > 0) {
          console.error(`Unable to add localization resource: ${item}`)
          errors.forEach(console.error)
        }
      })
    }

    return bundle
  }

  #getLocalizationItems(componentsLocalization: ComponentsLocalization) {
    const localizationItems: string[] = []
    Object.entries(componentsLocalization).forEach(([componentKey, allComponentsLocalizationConstants]) => {
      Object.entries(allComponentsLocalizationConstants ?? {}).forEach(([type, componentLocalizationConstants]) => {
        Object.entries(componentLocalizationConstants ?? {}).forEach(([propertyName, localizationConstant]) => {
          if (localizationConstant) {
            localizationItems.push(`${componentKey}_${type}_${propertyName} = ${replaceDots(localizationConstant)}`)
          }
        })
      })
    })
    return localizationItems
  }
}

/**
 * Observable storage of localization. **Internal use only.**
 */
export class LocalizationStore {

  private localizationCache = new Map<string, FluentBundleHolder>()

  /**
   * The localization data.
   */
  readonly value: LocalizationValue = {}

  /**
   * Returns value of localization constant.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language we are looking to localize.
   * @param componentKey the component we are looking to localize.
   * @param propertyName the property name we are looking to localize.
   * @param type the type of localization.
   * @returns the value of localization constant.
   */
  getLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType) {
    const fluentCompatibleComponentKey = getFluentCompatibleId(componentKey)
    const fluentCompatiblePropertyName = getFluentCompatibleId(propertyName)
    return this.value[languageFullCode]?.[fluentCompatibleComponentKey]?.[type]?.[fluentCompatiblePropertyName]
  }

  /**
   * Sets localization for component property.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language in which localization will be set.
   * @param componentKey the component key that requires localization.
   * @param propertyName the component's property name to be localized.
   * @param type the type of localization.
   * @param value the localization value.
   */
  setLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType, value: string) {
    const fluentCompatibleComponentKey = getFluentCompatibleId(componentKey)
    const fluentCompatiblePropertyName = getFluentCompatibleId(propertyName)
    this.value[languageFullCode] ??= {}
    this.value[languageFullCode][fluentCompatibleComponentKey] ??= {}
    this.value[languageFullCode][fluentCompatibleComponentKey][type] ??= {}
    this.value[languageFullCode][fluentCompatibleComponentKey][type]![fluentCompatiblePropertyName] = value
  }

  /**
   * Removes localization for component.
   * @param componentKey the component key that requires localization removal.
   */
  removeLocalization(componentKey: string) {
    const fluentCompatibleComponentKey = getFluentCompatibleId(componentKey)
    for (const languageFullCode of this.langCodes) {
      delete this.value[languageFullCode][fluentCompatibleComponentKey]
      if (Object.keys(this.value[languageFullCode]).length === 0) {
        delete this.value[languageFullCode]
      }
    }
  }

  /**
   * Removes localization for component with specified type.
   * @param componentKey the component key that requires localization removal.
   * @param type the localization type.
   */
  removeLocalizationForType(componentKey: string, type: LocalizationType) {
    const fluentCompatibleComponentKey = getFluentCompatibleId(componentKey)
    for (const languageFullCode of this.langCodes) {
      if (!this.value[languageFullCode][fluentCompatibleComponentKey]) continue
      delete this.value[languageFullCode][fluentCompatibleComponentKey][type]
      if (Object.keys(this.value[languageFullCode][fluentCompatibleComponentKey]).length === 0) {
        delete this.value[languageFullCode][fluentCompatibleComponentKey]
      }
      if (Object.keys(this.value[languageFullCode]).length === 0) {
        delete this.value[languageFullCode]
      }
    }
  }

  /**
   * Checks that the specified language exists in the localization.
   * @param languageFullCode The full code (en-US, en-GB etc.) of the language to be checked.
   * @returns true if the specified language exists in the localization.
   */
  hasLanguage(languageFullCode: LanguageFullCode) {
    return !!this.value[languageFullCode]
  }

  /**
   * Checks that the specified property has localization.
   * @param componentKey the component we are looking to localize.
   * @param propertyName the component's property name to be localized.
   * @param type the type of localization.
   * @returns true if the specified property has localization in at least one language.
   */
  hasLocalization(componentKey: string, propertyName: string, type: LocalizationType) {
    const key = getFluentCompatibleId(componentKey)
    const property = getFluentCompatibleId(propertyName)
    return Object.values(this.value).some(localization => {
      return localization?.[key]?.[type]?.[property]
    })
  }

  /**
   * If the FluentBundle for the specified language is found, this function returns it.
   * Otherwise, an empty FluentBundle is returned.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language to get fluent bundle.
   * @returns the FluentBundle for the specified language.
   */
  getFluentBundle(languageFullCode: LanguageFullCode) {
    const holder = this.localizationCache.get(languageFullCode) ?? new FluentBundleHolder(languageFullCode, this)
    if (!this.localizationCache.has(languageFullCode)) this.localizationCache.set(languageFullCode, holder)
    return holder.fluentBundle
  }

  /**
   * Changes the component key for all languages in the value object.
   * @param oldComponentKey the old component key to be replaced.
   * @param newComponentKey the new component key to replace the old component key.
   */
  changeComponentKey(oldComponentKey: string, newComponentKey: string) {
    const fluentCompatibleOldComponentKey = getFluentCompatibleId(oldComponentKey)
    const fluentCompatibleNewComponentKey = getFluentCompatibleId(newComponentKey)
    for (const languageFullCode of this.langCodes) {
      const component = this.value[languageFullCode][fluentCompatibleOldComponentKey]
      if (component) {
        this.value[languageFullCode][fluentCompatibleNewComponentKey] = component
        delete this.value[languageFullCode][fluentCompatibleOldComponentKey]
      }
    }
  }

  /**
   * Retrieves the localization values for a given component key.
   * @param componentKey the key of the component to retrieve localization for.
   * @returns the object containing the localization values for the component in each supported language.
   */
  getLocalizationForComponent(componentKey: string) {
    const fluentCompatibleComponentKey = getFluentCompatibleId(componentKey)
    const localization: LocalizationValue = {}
    for (const languageFullCode of this.langCodes) {
      const component = this.value[languageFullCode][fluentCompatibleComponentKey]
      if (component) {
        localization[languageFullCode] = {}
        localization[languageFullCode][componentKey] = component
      }
    }
    return localization
  }

  /**
   * Inserts the localization values for a given component key. Replaces the old component key with the new component key.
   * @param localization the localization object for insertion.
   * @param oldComponentKey the old component key that needs to be replaced.
   * @param newComponentKey the new component key to be added.
   */
  addLocalizationWithNewKey(localization: LocalizationValue, oldComponentKey: string, newComponentKey: string) {
    const fluentCompatibleNewComponentKey = getFluentCompatibleId(newComponentKey)
    const langCodes = Object.keys(localization) as Array<LanguageFullCode>
    for (const languageFullCode of langCodes) {
      const component = localization[languageFullCode][oldComponentKey]
      if (component) {
        this.value[languageFullCode][fluentCompatibleNewComponentKey] = component
      }
    }
  }

  /**
   * @returns the available language codes.
   */
  get langCodes() {
    return Object.keys(this.value) as Array<LanguageFullCode>
  }

  /**
   * The constructor.
   * @param value the initial localization value.
   */
  constructor(value: LocalizationValue = {}) {
    makeAutoObservable(this, undefined, {name: nameObservable(className)})

    this.value = value
  }
}
