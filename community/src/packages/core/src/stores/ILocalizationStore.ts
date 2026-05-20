import type {LanguageFullCode} from '../features/localization/language'

/**
 * Localization of the form.
 */
export interface ILocalizationStore {

  /**
   * Returns all localization items provided by engine.
   * @param languageFullCode the full code (en-US, en-GB etc.).
   * @returns all localization items.
   */
  getItems(languageFullCode: LanguageFullCode): Record<string, unknown> | null

  /**
   * Returns the localization constant for the component property.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language we are looking to localize.
   * @param componentKey the component we are looking to localize.
   * @param propertyName the property name we are looking to localize.
   * @param type the type of localization.
   * @returns the localization constant value.
   */
  getLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: string): unknown

  /**
   * Sets localization for component property.
   * @param languageFullCode the full code (en-US, en-GB etc.) of the language in which localization will be set.
   * @param componentKey the component key that requires localization.
   * @param propertyName the component's property name to be localized.
   * @param type the type of localization.
   * @param value the localization value to persist.
   */
  setLocalization(languageFullCode: LanguageFullCode, componentKey: string, propertyName: string, type: string, value: unknown): void
}
