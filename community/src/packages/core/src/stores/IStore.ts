import type {ValidationResult} from '../features/validation/types/ValidationResult'
import type {ComponentData} from '../utils/contexts/ComponentDataContext'
import type {IFormData} from '../utils/IFormData'
import type {ComponentStore} from './ComponentStore'
import type {Form} from './Form'
import type {LocalizationType} from './LocalizationStore'

/**
 * The form viewer settings interface.
 */
export interface IStore {
  /**
   * The displayed form.
   */
  form: Form

  /**
   * @returns the slice of the initial data in accordance with the Store hierarchy. **Internal use only.**
   */
  get initialDataSlice(): unknown

  /**
   * @returns true if all validation errors are to be displayed, false otherwise.
   */
  get showAllValidationErrors(): boolean | undefined

  /**
   * Performs the callback function on each element of the component tree, accumulates the return values.
   * @param callback the function that calculates the value for the accumulator.
   * @param initialValue the initial value for the accumulator.
   * @template T the return value type.
   * @returns the accumulated value.
   */
  reduceScreen: <T>(callback: (accumulator: T, current: ComponentData) => T, initialValue: T) => T

  /**
   * The function to localize the validation error message.
   * @param formData the form data.
   * @param componentStore the component settings.
   * @param validationResults the results of the validation.
   * @returns the result of localization or undefined.
   */
  localizeErrorMessages(formData: IFormData, componentStore: ComponentStore, validationResults?: ValidationResult[]): string[] | undefined

  /**
   * Localizes a component store based on the given localization type. If a custom localizer is available, it will be used.
   * @param type the type of localization.
   * @param formData the form data.
   * @param componentStore the component settings.
   * @returns the Record with the localized properties.
   */
  localizeComponent(type: LocalizationType, formData: IFormData, componentStore: ComponentStore): Record<string, unknown>

  /**
   * Correctly clears allocated resources, the function must be called when destroying an instance of the class.
   */
  dispose: () => void
}
