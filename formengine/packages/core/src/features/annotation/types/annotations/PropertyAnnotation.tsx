import type {LabeledValue} from '../../utils/LabeledValue'
import {Annotation} from './Annotation'

/**
 * Metadata for the component property for the form builder.
 */
export class PropertyAnnotation extends Annotation {
  /**
   * Possible values for the property.
   */
  data!: LabeledValue[]
}

/**
 * Type predicate, asserts that the value is an instance of PropertyAnnotation. **Internal use only.**
 * @param value the value.
 * @returns true if the value is an instance of PropertyAnnotation, false otherwise.
 */
export const isProperty = (value: Annotation): value is PropertyAnnotation => {
  return value instanceof PropertyAnnotation
}
