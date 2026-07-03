import type {ValidationMessages} from '../types/ValidationResult'
import type {FieldType} from './FieldType'

/**
 * Field with the form data.
 */
export interface Field {

  /**
   * The field type.
   */
  fieldType: FieldType

  /**
   * Flag, false if nested form data show as nested object, true otherwise.
   */
  storeDataInParentForm?: boolean

  /**
   * Contains a field validation error if the field data is not valid.
   */
  error?: string

  /**
   * Sets the error value.
   * @param error The error value to be set.
   */
  setError: (error: unknown) => void

  /**
   * Contains a field validation errors if the field provides multiple errors (i.e. field is template).
   * Contains an array of field validation errors if the field contains an array of components.
   */
  errors?: Record<string, unknown> | Array<Record<string, unknown>>

  /**
   * Flag, true, if the field is marked as touched.
   */
  touched: boolean

  /**
   * Value of the field.
   */
  value: unknown

  /**
   * The name of the component property that contains the field value.
   */
  valued: string

  /**
   * Sets the value of the field.
   * @param value the value.
   */
  setValue: (value: unknown) => void

  /**
   * Marks the field as touched.
   */
  setTouched: () => void

  /**
   * Validates the field value.
   */
  validate: () => Promise<void>

  /**
   * Returns the validation results without triggering an events and changing the state of the form.
   * @returns the {@link ValidationMessages} validation results.
   */
  getValidationResult: () => Promise<ValidationMessages | ValidationMessages[]>

  /**
   * Sets the field to its default value.
   */
  reset: () => void

  /**
   * Clears the data in the field.
   */
  clear: () => void

  /**
   * Releases allocated resources, must be used when destroying an object instance.
   */
  dispose: () => void

  /**
   * Initializes the value of the field.
   */
  init: () => void
}

/**
 * Describes the field of the component.
 */
export interface ComponentField {
  /**
   * The component data key.
   */
  dataKey: string
  /**
   * The component field.
   */
  field: Field
}
