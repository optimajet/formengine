import type {RuleValidator} from '../../../validation'
import type {ErrorMap} from '../../../validation/ErrorMap'
import {BaseBuilder} from './BaseBuilder'

/**
 * The builder class to define the metadata property of the form builder component.
 * Used for properties where the property value can be validated.
 * @template T the property type.
 */
export class TypedBuilder<T> extends BaseBuilder<T> {

  /**
   * Marks the component property as required.
   * @returns the modified instance of the builder.
   */
  get required(): TypedBuilder<NonNullable<T>> {
    return this.setup({required: true}) as TypedBuilder<NonNullable<T>>
  }

  /**
   * Sets the default value for the component property.
   * @param value the default value.
   * @returns the modified instance of the builder.
   */
  default(value: T): this {
    return this.setup({default: value})
  }

  /**
   * Modifies the component property metadata builder with validation properties.
   * @param validator the validation function.
   * @param errorMap the validation error settings.
   * @returns the modified instance of the builder.
   */
  validated(validator: RuleValidator<T>, errorMap: ErrorMap): this {
    return this.setup({validator, errorMap})
  }
}
