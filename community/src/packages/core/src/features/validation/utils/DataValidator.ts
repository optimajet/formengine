import {debounce} from 'lodash-es'
import type {IStore} from '../../../stores/IStore'
import type {Setter} from '../../../types'
import type {IFormData} from '../../../utils/IFormData'
import type {ValidationResult} from '../types/ValidationResult'

/**
 * A function that localizes validation error messages.
 * @param value the results of the validation.
 * @returns the localization result or undefined.
 */
export type ErrorMessageLocalizer = (value: ValidationResult[] | undefined) => string | undefined

/**
 * The function that validates a value and returns the validation result.
 * @param value the validated value.
 * @param store the form viewer settings.
 * @param getFormData the function that returns a form data.
 * @returns the Promise with the results of the validation.
 */
export type ResolvedValidator = (value: any, store: IStore, getFormData?: () => IFormData) => Promise<ValidationResult[] | undefined>

/**
 * The validation function factory.
 * @param value the validated value.
 * @template T the validation function factory arguments.
 * @returns the function that validates a value.
 */
export type SchemaResolver<T> = (value: T) => ResolvedValidator

/**
 * Returns the default error message for the validation result.
 * @param result the validation result.
 * @returns the default error message for the validation result.
 */
export function getDefaultErrorMessage(result: ValidationResult) {
  return result.message ?? `Validation failed: ${result.settings.key}`
}

function concatErrorMessages(value: ValidationResult[] | undefined) {
  if (!value) return undefined
  return value?.map(getDefaultErrorMessage).join(' ')
}

/**
 * Binds all parts of the validation and performs the validation.
 */
export class DataValidator {
  readonly #validator
  readonly #localizedValidator
  readonly #debouncedValidator

  private constructor(
    store: IStore,
    getFormData: () => IFormData,
    validator: ResolvedValidator,
    setter: Setter<string | undefined>,
    errorMessageLocalizer?: ErrorMessageLocalizer
  ) {
    const localizer = (messages?: ValidationResult[]) => {
      if (!messages || messages.length === 0) return undefined
      if (store.showAllValidationErrors) {
        return (errorMessageLocalizer ?? concatErrorMessages)(messages)
      }
      return errorMessageLocalizer?.([messages[0]]) ?? getDefaultErrorMessage(messages[0])
    }

    this.#validator = (value: any) => validator(value, store, getFormData)

    this.#localizedValidator = async (value: any) => {
      const result = await validator(value, store, getFormData)
      const error = localizer(result)
      setter(error)
      return error
    }

    this.#debouncedValidator = debounce(this.#localizedValidator, 200)
  }

  /**
   * Creates a DataValidator instance.
   * @param store the form viewer settings.
   * @param getFormData the function that returns a form data.
   * @param resolver the validation function factory.
   * @param args the validation function factory arguments.
   * @param setter the callback function called to set a validation error.
   * @param localizer the function that localizes validation error messages.
   * @template T the validation function factory arguments.
   * @returns the DataValidator instance.
   */
  static create = <T>(store: IStore, getFormData: () => IFormData, resolver: SchemaResolver<T>, args: T,
                      setter: Setter<string | undefined>, localizer?: ErrorMessageLocalizer) => {
    return new DataValidator(store, getFormData, resolver(args), setter, localizer)
  }

  /**
   * Generates an event to perform validation.
   * @param value the validated value.
   */
  sendValidationEvent = (value: any) => {
    this.#debouncedValidator(value)?.catch(console.error)
  }

  /**
   * Performs a validation of the value.
   * @param value the validated value.
   * @returns the Promise with the result of the validation.
   */
  validate = async (value: any) => {
    return await this.#localizedValidator(value)
  }

  /**
   * Returns the validation results without triggering an events and changing the state of the form.
   * @param value the validated value.
   * @returns the validation results.
   */
  getValidationResult = (value: any) => {
    return this.#validator(value)
  }
}
