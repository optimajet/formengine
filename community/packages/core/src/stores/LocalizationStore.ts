import {makeAutoObservable} from 'mobx'
import type {ILocalizationEngine} from '../features/localization/ILocalizationEngine'
import type {LanguageFullCode} from '../features/localization/language'
import type {ComponentsLocalization, LocalizationType, LocalizationValue} from '../features/localization/types'
import {nameObservable} from '../utils/observableNaming'
import {isUndefined} from '../utils/tools'
import type {ILocalizationStore} from './ILocalizationStore'

const className = 'LocalizationStore'

class LocalizationRepository {
  constructor(
    private readonly getValue: () => LocalizationValue,
    private readonly getCompatibleId: (rawId: string) => string
  ) {
  }

  initializeLanguageState(configuredLanguageCodes: Set<LanguageFullCode>) {
    const value = this.getValue()
    for (const key of Object.keys(value) as LanguageFullCode[]) {
      configuredLanguageCodes.add(key)
      if (this.#isLanguageBucketEmpty(key)) {
        delete value[key]
      }
    }
  }

  getLocalization(targetLanguage: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType) {
    const compatibleKey = this.getCompatibleId(componentKey)
    const compatibleName = this.getCompatibleId(propertyName)
    return this.getValue()[targetLanguage]?.[compatibleKey]?.[type]?.[compatibleName]
  }

  setLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType, value: unknown) {
    const compatibleId = this.getCompatibleId(componentKey)
    const compatibleName = this.getCompatibleId(propertyName)

    if (value === '') {
      this.#removeLocalizationProperty(languageFullCode, compatibleId, type, compatibleName)
      return
    }

    const localization = this.getValue()
    localization[languageFullCode] ??= {}
    localization[languageFullCode][compatibleId] ??= {}
    localization[languageFullCode][compatibleId][type] ??= {}
    localization[languageFullCode][compatibleId][type][compatibleName] = value
  }

  removeLocalization(componentKey: string, langCodes: LanguageFullCode[]) {
    const compatibleKey = this.getCompatibleId(componentKey)

    for (const languageFullCode of langCodes) {
      const languageLocalization = this.getValue()[languageFullCode]
      if (!languageLocalization) continue

      delete languageLocalization[compatibleKey]
      if (Object.keys(languageLocalization).length === 0) {
        delete this.getValue()[languageFullCode]
      }
    }
  }

  removeLocalizationForType(componentKey: string, type: LocalizationType, langCodes: LanguageFullCode[]) {
    const compatibleKey = this.getCompatibleId(componentKey)

    for (const languageFullCode of langCodes) {
      const languageLocalization = this.getValue()[languageFullCode]
      if (!languageLocalization?.[compatibleKey]) continue

      delete languageLocalization[compatibleKey][type]
      if (Object.keys(languageLocalization[compatibleKey]).length === 0) {
        delete languageLocalization[compatibleKey]
      }
      if (Object.keys(languageLocalization).length === 0) {
        delete this.getValue()[languageFullCode]
      }
    }
  }

  hasLocalization(componentKey: string, propertyName: string, type: LocalizationType) {
    const key = this.getCompatibleId(componentKey)
    const property = this.getCompatibleId(propertyName)

    return Object.values(this.getValue()).some(localization => {
      return !isUndefined(localization?.[key]?.[type]?.[property])
    })
  }

  getLocalizationForComponent(componentKey: string, langCodes: LanguageFullCode[]) {
    const compatibleKey = this.getCompatibleId(componentKey)
    const localization: LocalizationValue = {}

    for (const languageFullCode of langCodes) {
      const languageLocalization = this.getValue()[languageFullCode]
      if (!languageLocalization) continue

      const component = languageLocalization[compatibleKey]
      if (component) {
        localization[languageFullCode] = {}
        localization[languageFullCode][componentKey] = component
      }
    }
    return localization
  }

  addLocalizationWithNewKey(localization: LocalizationValue, oldComponentKey: string, newComponentKey: string) {
    const compatibleKey = this.getCompatibleId(newComponentKey)
    const langCodes = Object.keys(localization) as Array<LanguageFullCode>

    for (const languageFullCode of langCodes) {
      const component = localization[languageFullCode][oldComponentKey]
      if (!component) continue

      const storeValue = this.getValue()
      storeValue[languageFullCode] ??= {}
      storeValue[languageFullCode][compatibleKey] = component
    }
  }

  changeComponentKey(oldComponentKey: string, newComponentKey: string, langCodes: LanguageFullCode[]) {
    const compatibleOldKey = this.getCompatibleId(oldComponentKey)
    const compatibleNewKey = this.getCompatibleId(newComponentKey)

    for (const languageFullCode of langCodes) {
      const languageLocalization = this.getValue()[languageFullCode]
      if (!languageLocalization) continue

      const component = languageLocalization[compatibleOldKey]
      if (component) {
        languageLocalization[compatibleNewKey] = component
        delete languageLocalization[compatibleOldKey]
      }
    }
  }

  #removeLocalizationProperty(
    languageFullCode: LanguageFullCode,
    compatibleId: string,
    type: LocalizationType,
    compatibleName: string
  ) {
    const localization = this.getValue()
    const langBucket = localization[languageFullCode]
    const componentBucket = langBucket?.[compatibleId]
    const typeBucket = componentBucket?.[type]
    if (!typeBucket || !Object.prototype.hasOwnProperty.call(typeBucket, compatibleName)) return

    delete typeBucket[compatibleName]

    if (Object.keys(typeBucket).length === 0) {
      delete componentBucket[type]
    }
    if (componentBucket && Object.keys(componentBucket).length === 0) {
      delete langBucket[compatibleId]
    }
    if (langBucket && Object.keys(langBucket).length === 0) {
      delete localization[languageFullCode]
    }
  }

  #isLanguageBucketEmpty(languageFullCode: LanguageFullCode) {
    const localization = this.getValue()[languageFullCode]
    return !!localization && Object.keys(localization).length === 0
  }
}

class LocalizationLanguageResolver {
  constructor(
    private readonly configuredLanguageCodes: Set<LanguageFullCode>,
    private readonly hasTranslations: (language: LanguageFullCode) => boolean,
    private readonly withTranslationsLanguageKeys: () => LanguageFullCode[],
  ) {
  }

  findLocalizationKey(languageFullCode: LanguageFullCode): LanguageFullCode | null {
    const {
      exactConfigured,
      exactWithTranslations,
      sameCodeConfigured,
      sameCodeWithTranslations
    } = this.#resolveLanguageMatch(languageFullCode)

    if (exactWithTranslations) return exactWithTranslations
    if (sameCodeWithTranslations) return sameCodeWithTranslations
    if (exactConfigured) return exactConfigured
    if (sameCodeConfigured) return sameCodeConfigured

    return null
  }

  hasLanguage(languageFullCode: LanguageFullCode) {
    return this.#findConfiguredLanguageKey(languageFullCode) !== null
  }

  #findConfiguredLanguageKey(languageFullCode: LanguageFullCode): LanguageFullCode | null {
    const {exactConfigured, sameCodeConfigured} = this.#resolveLanguageMatch(languageFullCode)
    return exactConfigured ?? sameCodeConfigured ?? null
  }

  #findExactLanguageWithTranslationsKey(languageFullCode: LanguageFullCode): LanguageFullCode | null {
    return this.hasTranslations(languageFullCode) ? languageFullCode : null
  }

  #findExactConfiguredLanguageKey(languageFullCode: LanguageFullCode): LanguageFullCode | null {
    if (this.hasTranslations(languageFullCode) || this.configuredLanguageCodes.has(languageFullCode)) {
      return languageFullCode
    }
    return null
  }

  #findLanguageByCode(languageFullCode: LanguageFullCode, onlyWithTranslations: boolean): LanguageFullCode | null {
    const [code] = languageFullCode.split('-')
    for (const key of this.withTranslationsLanguageKeys()) {
      if (!key.startsWith(`${code}-`)) continue
      if (!onlyWithTranslations || this.hasTranslations(key)) {
        return key
      }
    }
    return null
  }

  #resolveLanguageMatch(languageFullCode: LanguageFullCode) {
    const exactConfigured = this.#findExactConfiguredLanguageKey(languageFullCode)

    const sameCodeConfigured = this.#findLanguageByCode(languageFullCode, false)
      ?? this.#findConfiguredLanguageByCode(languageFullCode)

    const exactWithTranslations = this.#findExactLanguageWithTranslationsKey(languageFullCode)
    const sameCodeWithTranslations = this.#findLanguageByCode(languageFullCode, true)

    return {
      exactConfigured,
      sameCodeConfigured,
      exactWithTranslations,
      sameCodeWithTranslations,
    }
  }

  #findConfiguredLanguageByCode(languageFullCode: LanguageFullCode): LanguageFullCode | null {
    const [code] = languageFullCode.split('-')
    for (const key of this.configuredLanguageCodes) {
      if (key.startsWith(`${code}-`)) return key
    }
    return null
  }
}

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
    const localizationItems: Record<string, unknown> = {}
    const {engine} = this.localizationStore

    Object.entries(componentsLocalization).forEach(([componentKey, allComponentsLocalizationConstants]) => {
      Object.entries(allComponentsLocalizationConstants ?? {}).forEach(([type, componentLocalizationConstants]) => {
        Object.entries(componentLocalizationConstants ?? {}).forEach(([propertyName, localizationConstant]) => {
          if (!isUndefined(localizationConstant) && localizationConstant !== null) {
            const normalizedId = `${engine.getCompatibleId(componentKey)}_${type}_${engine.getCompatibleId(propertyName)}`
            localizationItems[normalizedId] = localizationConstant
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
  private configuredLanguageCodes = new Set<LanguageFullCode>()
  private repository: LocalizationRepository
  private resolver: LocalizationLanguageResolver

  /**
   * Creates a new LocalizationStore instance.
   * @param value the initial localization value.
   * @param engine the localization engine to use.
   */
  constructor(readonly value: LocalizationValue = {}, readonly engine: ILocalizationEngine) {
    this.repository = new LocalizationRepository(() => this.value, this.engine.getCompatibleId.bind(this.engine))
    this.resolver = new LocalizationLanguageResolver(
      this.configuredLanguageCodes,
      this.#hasTranslations.bind(this),
      () => Object.keys(this.value) as LanguageFullCode[],
    )
    this.#initializeLanguageState()
    makeAutoObservable(this, undefined, {name: nameObservable(className)})
  }

  #initializeLanguageState() {
    this.repository.initializeLanguageState(this.configuredLanguageCodes)
  }

  #clearLocalizationCache() {
    this.localizationCache.clear()
  }

  /**
   * Returns value of localization constant.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language we are looking to localize.
   * @param componentKey the component we are looking to localize.
   * @param propertyName the property name we are looking to localize.
   * @param type the type of localization.
   * @returns the value of localization constant.
   */
  getLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType): unknown {
    const targetKey = this.findLocalizationKey(languageFullCode) ?? languageFullCode

    return this.repository.getLocalization(targetKey, componentKey, propertyName, type)
  }

  /**
   * Returns normalized localization item id for the component property.
   * @param componentKey the component key.
   * @param propertyName the component property name.
   * @returns normalized localization item id.
   */
  getLocalizationItemId(componentKey: string, propertyName: string) {
    return this.engine.getCompatibleId(`${componentKey}_${propertyName}`)
  }

  /**
   * Sets localization for component property.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language in which localization will be set.
   * @param componentKey the component key that requires localization.
   * @param propertyName the component's property name to be localized.
   * @param type the type of localization.
   * @param value the localization value to persist.
   */
  setLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType, value: unknown) {
    this.repository.setLocalization(languageFullCode, componentKey, propertyName, type, value)
    this.#clearLocalizationCache()
  }

  /**
   * Removes localization for component.
   * @param componentKey the component key that requires localization removal.
   */
  removeLocalization(componentKey: string) {
    this.repository.removeLocalization(componentKey, this.langCodes)
    this.#clearLocalizationCache()
  }

  /**
   * Removes localization for component with specified type.
   * @param componentKey the component key that requires localization removal.
   * @param type the localization type.
   */
  removeLocalizationForType(componentKey: string, type: LocalizationType) {
    this.repository.removeLocalizationForType(componentKey, type, this.langCodes)
    this.#clearLocalizationCache()
  }

  /**
   * Checks that the specified language exists in the localization.
   * Looks for exact match first, then match by language code only.
   * @param languageFullCode The full code (en-US, en-GB etc.) of the language to be checked.
   * @returns true if the specified language exists in the localization.
   */
  hasLanguage(languageFullCode: LanguageFullCode) {
    return this.resolver.hasLanguage(languageFullCode)
  }

  /**
   * Checks that the specified property has localization.
   * @param componentKey the component we are looking to localize.
   * @param propertyName the component's property name to be localized.
   * @param type the type of localization.
   * @returns true if the specified property has localization in at least one language.
   */
  hasLocalization(componentKey: string, propertyName: string, type: LocalizationType) {
    return this.repository.hasLocalization(componentKey, propertyName, type)
  }

  /**
   * Finds the best matching localization key for the given language code.
   * Looks for exact match first, then match by language code only.
   * @param languageFullCode the requested language full code.
   * @returns the best matching language full code or null if no match found.
   */
  findLocalizationKey(languageFullCode: LanguageFullCode): LanguageFullCode | null {
    return this.resolver.findLocalizationKey(languageFullCode)
  }

  #hasTranslations(languageFullCode: LanguageFullCode): boolean {
    const localization = this.value[languageFullCode]
    return !!localization && Object.keys(localization).length > 0
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
    this.repository.changeComponentKey(oldComponentKey, newComponentKey, this.langCodes)
    this.#clearLocalizationCache()
  }

  /**
   * Retrieves the localization values for a given component key.
   * @param componentKey the key of the component to retrieve localization for.
   * @returns the object containing the localization values for the component in each supported language.
   */
  getLocalizationForComponent(componentKey: string) {
    return this.repository.getLocalizationForComponent(componentKey, this.langCodes)
  }

  /**
   * Inserts the localization values for a given component key. Replaces the old component key with the new component key.
   * @param localization the localization object for insertion.
   * @param oldComponentKey the old component key that needs to be replaced.
   * @param newComponentKey the new component key to be added.
   */
  addLocalizationWithNewKey(localization: LocalizationValue, oldComponentKey: string, newComponentKey: string) {
    this.repository.addLocalizationWithNewKey(localization, oldComponentKey, newComponentKey)
    this.#clearLocalizationCache()
  }

  /**
   * @returns the available language codes.
   */
  get langCodes() {
    return [...new Set([
      ...Object.keys(this.value),
      ...this.configuredLanguageCodes,
    ])] as Array<LanguageFullCode>
  }
}
