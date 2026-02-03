import {makeAutoObservable} from 'mobx'
import type {ILocalizationEngine} from '../features/localization/ILocalizationEngine'
import type {LanguageFullCode} from '../features/localization/language'
import type {ComponentsLocalization, LocalizationType, LocalizationValue} from '../features/localization/types'
import {nameObservable} from '../utils/observableNaming'
import type {ILocalizationStore} from './ILocalizationStore'

const className = 'LocalizationStore'

class LocalizationObservable {

  constructor(readonly languageFullCode: LanguageFullCode,
              readonly localizationStore: LocalizationStore) {
    makeAutoObservable(this, undefined, {name: nameObservable('LocalizationObservable')})
  }

  get items() {
    const foundKey = this.localizationStore.findLocalizationKey(this.languageFullCode)
    const componentsLocalization = foundKey ? this.localizationStore.value[foundKey] : null
    const {engine} = this.localizationStore

    if (componentsLocalization) {
      const localizationItems = this.#getLocalizationItems(componentsLocalization)
      const errors = engine.addMessages(this.languageFullCode, localizationItems)

      if (errors.length !== 0) {
        console.error(`Unable to add localization resource: ${errors}`)
        return null
      }

      return localizationItems
    }

    return null
  }

  #getLocalizationItems(componentsLocalization: ComponentsLocalization) {
    const localizationItems: Record<string, string> = {}

    Object.entries(componentsLocalization).forEach(([componentKey, allComponentsLocalizationConstants]) => {
      Object.entries(allComponentsLocalizationConstants ?? {}).forEach(([type, componentLocalizationConstants]) => {
        Object.entries(componentLocalizationConstants ?? {}).forEach(([propertyName, localizationConstant]) => {
          if (localizationConstant) {
            localizationItems[`${componentKey}_${type}_${propertyName}`] = localizationConstant
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
export class LocalizationStore implements ILocalizationStore {

  private localizationCache = new Map<string, LocalizationObservable>()

  /**
   * Creates a new LocalizationStore instance.
   * @param value the initial localization value.
   * @param engine the localization engine to use.
   */
  constructor(readonly value: LocalizationValue = {}, readonly engine: ILocalizationEngine) {
    makeAutoObservable(this, undefined, {name: nameObservable(className)})
  }

  /**
   * Returns value of localization constant.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language we are looking to localize.
   * @param componentKey the component we are looking to localize.
   * @param propertyName the property name we are looking to localize.
   * @param type the type of localization.
   * @returns the value of localization constant.
   */
  getLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType) {
    const compatibleKey = this.engine.getCompatibleId(componentKey)
    const compatibleName = this.engine.getCompatibleId(propertyName)
    const targetKey = this.findLocalizationKey(languageFullCode) ?? languageFullCode

    return this.value[targetKey]?.[compatibleKey]?.[type]?.[compatibleName]
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
    const compatibleId = this.engine.getCompatibleId(componentKey)
    const compatibleName = this.engine.getCompatibleId(propertyName)
    this.value[languageFullCode] ??= {}
    this.value[languageFullCode][compatibleId] ??= {}
    this.value[languageFullCode][compatibleId][type] ??= {}
    this.value[languageFullCode][compatibleId][type][compatibleName] = value
  }

  /**
   * Removes localization for component.
   * @param componentKey the component key that requires localization removal.
   */
  removeLocalization(componentKey: string) {
    const compatibleKey = this.engine.getCompatibleId(componentKey)

    for (const languageFullCode of this.langCodes) {
      delete this.value[languageFullCode][compatibleKey]
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
    const compatibleKey = this.engine.getCompatibleId(componentKey)

    for (const languageFullCode of this.langCodes) {
      if (!this.value[languageFullCode][compatibleKey]) continue
      delete this.value[languageFullCode][compatibleKey][type]
      if (Object.keys(this.value[languageFullCode][compatibleKey]).length === 0) {
        delete this.value[languageFullCode][compatibleKey]
      }
      if (Object.keys(this.value[languageFullCode]).length === 0) {
        delete this.value[languageFullCode]
      }
    }
  }

  /**
   * Checks that the specified language exists in the localization.
   * Looks for exact match first, then match by language code only.
   * @param languageFullCode The full code (en-US, en-GB etc.) of the language to be checked.
   * @returns true if the specified language exists in the localization.
   */
  hasLanguage(languageFullCode: LanguageFullCode) {
    return this.findLocalizationKey(languageFullCode) !== null
  }

  /**
   * Checks that the specified property has localization.
   * @param componentKey the component we are looking to localize.
   * @param propertyName the component's property name to be localized.
   * @param type the type of localization.
   * @returns true if the specified property has localization in at least one language.
   */
  hasLocalization(componentKey: string, propertyName: string, type: LocalizationType) {
    const key = this.engine.getCompatibleId(componentKey)
    const property = this.engine.getCompatibleId(propertyName)

    return Object.values(this.value).some(localization => {
      return localization?.[key]?.[type]?.[property]
    })
  }

  /**
   * Finds the best matching localization key for the given language code.
   * Looks for exact match first, then match by language code only.
   * @param languageFullCode the requested language full code.
   * @returns the best matching language full code or null if no match found.
   */
  findLocalizationKey(languageFullCode: LanguageFullCode): LanguageFullCode | null {
    if (this.value[languageFullCode]) {
      return languageFullCode
    }

    const [code] = languageFullCode.split('-')
    for (const key of Object.keys(this.value)) {
      if (key.startsWith(`${code}-`)) {
        return key as LanguageFullCode
      }
    }

    return null
  }

  /**
   * @inheritDoc
   */
  getItems(languageFullCode: LanguageFullCode) {
    const holder = this.localizationCache.get(languageFullCode) ?? new LocalizationObservable(languageFullCode, this)

    if (!this.localizationCache.has(languageFullCode)) this.localizationCache.set(languageFullCode, holder)

    return holder.items
  }

  /**
   * Changes the component key for all languages in the value object.
   * @param oldComponentKey the old component key to be replaced.
   * @param newComponentKey the new component key to replace the old component key.
   */
  changeComponentKey(oldComponentKey: string, newComponentKey: string) {
    const compatibleOldKey = this.engine.getCompatibleId(oldComponentKey)
    const compatibleNewKey = this.engine.getCompatibleId(newComponentKey)

    for (const languageFullCode of this.langCodes) {
      const component = this.value[languageFullCode][compatibleOldKey]
      if (component) {
        this.value[languageFullCode][compatibleNewKey] = component
        delete this.value[languageFullCode][compatibleOldKey]
      }
    }
  }

  /**
   * Retrieves the localization values for a given component key.
   * @param componentKey the key of the component to retrieve localization for.
   * @returns the object containing the localization values for the component in each supported language.
   */
  getLocalizationForComponent(componentKey: string) {
    const compatibleKey = this.engine.getCompatibleId(componentKey)
    const localization: LocalizationValue = {}

    for (const languageFullCode of this.langCodes) {
      const component = this.value[languageFullCode][compatibleKey]
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
    const compatibleKey = this.engine.getCompatibleId(newComponentKey)
    const langCodes = Object.keys(localization) as Array<LanguageFullCode>

    for (const languageFullCode of langCodes) {
      const component = localization[languageFullCode][oldComponentKey]
      if (component) {
        this.value[languageFullCode][compatibleKey] = component
      }
    }
  }

  /**
   * @returns the available language codes.
   */
  get langCodes() {
    return Object.keys(this.value) as Array<LanguageFullCode>
  }
}
