import type {ComponentStore} from '../../stores/ComponentStore'
import type {IForm} from '../../stores/IForm'
import type {IFormData} from '../../utils/IFormData'
import type {Language, LanguageFullCode} from './language'
import type {LocalizationError} from './LocalizationError'
import type {LocalizationType} from './types'

/**
 * The form localization engine.
 */
export interface ILocalizationEngine {
  /**
   * The current language.
   */
  language: LanguageFullCode

  /**
   * Adds messages to the localization engine.
   * @param locale the locale for the messages.
   * @param messages the messages to add.
   * @returns the array of any localization errors that occurred.
   */
  addMessages(locale: string, messages: Record<string, string>): Array<LocalizationError>

  /**
   * Gets a compatible ID for localization engine.
   * @param rawId the raw ID to make compatible.
   * @returns the compatible ID.
   */
  getCompatibleId(rawId: string): string

  /**
   * Localizes properties for a component.
   * @param form the form containing localization data.
   * @param formData the form data for variable substitution.
   * @param language the target language for localization.
   * @param componentStore the component store to localize.
   * @param type the type of localization (default: 'component').
   * @returns the object with localized property values.
   */
  localizeProperties(form: IForm,
                     formData: IFormData,
                     language: Language,
                     componentStore: ComponentStore,
                     type?: LocalizationType): Record<string, any>

  /**
   * Localizes error messages for validation rules.
   * @param form the form containing localization data.
   * @param formData the form data for variable substitution.
   * @param language the target language for localization.
   * @param componentStore the component store to localize.
   * @param ruleKey the validation rule key.
   * @returns the localized error message or undefined.
   */
  localizeErrorMessage(form: IForm,
                       formData: IFormData,
                       language: Language,
                       componentStore: ComponentStore,
                       ruleKey: string): string | undefined

  /**
   * Tests localization by formatting a message with given data.
   * @param localization the localization string to test.
   * @param localizationStringId the ID of the localization string.
   * @param language the language for the test.
   * @param formData the data to use for variable substitution.
   * @returns the array of errors or the formatted result string.
   */
  testLocalization?: (localization: string,
                      localizationStringId: string,
                      language: Language,
                      formData: IFormData) => Array<LocalizationError> | string
}
