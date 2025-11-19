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
  getItems(languageFullCode: LanguageFullCode): Record<string, string> | null
}
