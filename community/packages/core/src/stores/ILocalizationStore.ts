import type {ILocalizationEngine} from '../features/localization/ILocalizationEngine'
import type {LanguageFullCode} from '../features/localization/language'
import type {LocalizationType, LocalizationValue} from '../features/localization/types'

/**
 * Localization of the form.
 */
export interface ILocalizationStore {
  /**
   * The localization value object.
   */
  readonly value: LocalizationValue

  /**
   * The localization engine.
   */
  readonly engine: ILocalizationEngine

  /**
   * Returns the localization value for the given language, component, property and type.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language.
   * @param componentKey the component key.
   * @param propertyName the component property name.
   * @param type the localization type.
   * @returns the localization value.
   */
  getLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType): unknown

  /**
   * Sets localization for a component property.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language.
   * @param componentKey the component key.
   * @param propertyName the component property name.
   * @param type the localization type.
   * @param value the localization value.
   */
  setLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: LocalizationType, value: unknown): void

  /**
   * Removes localization for a component.
   * @param componentKey the component key.
   */
  removeLocalization(componentKey: string): void

  /**
   * Removes localization for a component with the specified type.
   * @param componentKey the component key.
   * @param type the localization type.
   */
  removeLocalizationForType(componentKey: string, type: LocalizationType): void

  /**
   * Returns true if at least one localization exists for the component property and type.
   * @param componentKey the component key.
   * @param propertyName the component property name.
   * @param type the localization type.
   * @returns true if localization exists.
   */
  hasLocalization(componentKey: string, propertyName: string, type: LocalizationType): boolean

  /**
   * Checks if the specified language exists in localization.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language.
   * @returns true if language exists.
   */
  hasLanguage(languageFullCode: LanguageFullCode): boolean

  /**
   * Returns normalized localization item id for the component property.
   * @param componentKey the component key.
   * @param propertyName the component property name.
   * @returns normalized localization item id.
   */
  getLocalizationItemId(componentKey: string, propertyName: string): string

  /**
   * Returns all localization items provided by engine.
   * @param languageFullCode the full code (en-US, en-GB etc.).
   * @returns all localization items.
   */
  getItems(languageFullCode: LanguageFullCode): Record<string, unknown> | null
}
