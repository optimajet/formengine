import type {FluentVariable} from '@fluent/bundle/esm/bundle'
import type {ValidationMessages} from '../features/validation/types/ValidationResult'

/**
 * The interface for accessing the form data.
 */
export interface IFormData {
  /**
   * @returns the Record with all the form data.
   */
  get data(): Record<string, unknown>

  /**
   * @returns the object to read and modify parent data (available for array elements).
   */
  get parentData(): Record<string, unknown> | undefined

  /**
   * @returns the object to read and modify root form data.
   */
  get rootData(): Record<string, unknown>

  /**
   * @returns the Record with all validation error messages.
   */
  get errors(): Record<string, unknown>

  /**
   * Sets the form error messages.
   */
  set errors(errors: Record<string, unknown>)

  /**
   * true if the form contains errors, otherwise false.
   */
  get hasErrors(): boolean

  /**
   * @returns A user-defined key-value observable storage. Utilize it to store and share any custom data.
   */
  get state(): Record<string, unknown>

  /**
   * @returns all the form data that is of the FluentVariable type.
   * Additionally, the keys of the returned object are converted to the snake case.
   */
  get fluentData(): Record<string, FluentVariable>

  /**
   * Sets the validation error message for all form data fields.
   * @param message the validation error message.
   */
  setAllErrors: (message?: string) => void

  /**
   * Validates the data in the form.
   * @returns the {@link ValidationMessages} validation results.
   */
  validate: () => Promise<ValidationMessages>

  /**
   * Returns the validation results without triggering an events and changing the state of the form.
   * @returns the {@link ValidationMessages} validation results.
   */
  getValidationResult: () => Promise<ValidationMessages>

  /**
   * If true, then validation is in progress.
   */
  get isValidating(): boolean

  /**
   * Sets the form to its default value.
   * @param clearInitialData if true, then also clear the initial data. @default true
   */
  reset: (clearInitialData?: boolean) => void

  /**
   * Clears the form data.
   * @param clearInitialData if true, then also clear the initial data. @default true
   */
  clear: (clearInitialData?: boolean) => void

  /**
   * @returns the index in the array if the component is in the component array.
   */
  index?: number
}

/**
 * Description of the form data for the code editor.
 */
export const IFormDataDeclaration = `declare interface IFormData {
  /**
   * @returns the {@link Record} with all the form data.
   */
  get data(): Record<string, unknown>

  /**
   * @returns the object to read and modify parent data (available for array elements).
   */
  get parentData(): Record<string, unknown> | undefined

  /**
   * @returns the object to read and modify root form data.
   */
  get rootData(): Record<string, unknown>

  /**
   * @returns the {@link Record} with all validation error messages.
   */
  get errors(): Record<string, unknown>

  /**
   * true if the form contains errors, otherwise false.
   */
  get hasErrors(): boolean

  /**
   * @returns A user-defined key-value observable storage. Utilize it to store and share any custom data.
   */
  get state(): Record<string, unknown>

  /**
   * Sets the validation error message for all form data fields.
   * @param message the validation error message.
   */
  setAllErrors(message?: string): void

  /**
   * Validates the data in the form.
   */
  validate(): Promise<void>

  /**
   * Returns the validation results without triggering an events and changing the state of the form.
   * @returns the validation results.
   */
  getValidationResult: () => Promise<ValidationMessages>

  /**
   * If true, then validation is in progress.
   */
  get isValidating(): boolean

  /**
   * Sets the form to its default value.
   * @param clearInitialData if true, then also clear the initial data. @default true
   */
  reset(clearInitialData?: boolean): void

  /**
   * Clears the form data.
   * @param clearInitialData if true, then also clear the initial data. @default true
   */
  clear(clearInitialData?: boolean): void

  /**
   * @returns the index in the array if the component is in the component array.
   */
  index?: number
}`
