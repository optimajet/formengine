import {startCase} from '../../../../utils/tools'
import type {Annotation} from '../../types/annotations/Annotation'
import type {PropertyAnnotation} from '../../types/annotations/PropertyAnnotation'
import {TypedBuilder} from './TypedBuilder'

/**
 * The abstract builder class to define the metadata property of the form builder component.
 * Used for properties where the property value can be selected from predefined values.
 * @template T the property type.
 */
export abstract class QuantifierBuilder<T> extends TypedBuilder<T> {
  /**
   * Possible values for the property.
   */
  values!: (string | number)[]
  /**
   * Labels for the possible values of the property.
   */
  labels?: string[]

  /**
   * Marks the component property as required.
   * @returns the modified instance of the builder.
   */
  get required(): QuantifierBuilder<NonNullable<T>> {
    return super.required as QuantifierBuilder<NonNullable<T>>
  }

  /**
   * Sets the labels for predefined values.
   * @param labels the labels.
   * @returns the modified instance of the builder.
   */
  labeled(...labels: string[]) {
    const clone = this.clone()
    clone.labels = labels
    return clone
  }

  /**
   * Creates component property metadata for the form builder.
   * @param key the unique key of the component property.
   * @returns the instance of the component property metadata for the form builder.
   */
  build(key: string): Annotation {
    const result = super.build(key) as PropertyAnnotation
    result.data = this.values.map((value, index) => {
      const label = this.labels?.[index] ?? startCase(value.toString())
      return {label, value}
    })

    return result
  }

  /**
   * Sets the default value for the component property.
   * @param value the default value, can be an array of values.
   * @returns the modified instance of the builder.
   */
  default(value: T | T[]): this {
    return this.setup({default: value})
  }
}
