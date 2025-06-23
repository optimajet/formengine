import {calculateExpressionProperty} from '../features/calculation/propertyCalculator'
import type {ComponentProperty} from '../stores/ComponentStore'
import {isFunctionalProperty} from '../stores/ComponentStore'
import type {IFormData} from './IFormData'

/**
 * Returns true if the validation should be executed, false otherwise.
 * @param property the validateWhen property.
 * @param formData the form data.
 * @returns true if the validation should be executed, false otherwise.
 */
export function needValidate(property?: ComponentProperty, formData?: IFormData) {
  if (!property || !formData) return true

  if (!isFunctionalProperty(property)) {
    if (typeof property.value === 'string' && property.value.trim() === '') return true
  }

  return calculateExpressionProperty(property, formData) === true
}
