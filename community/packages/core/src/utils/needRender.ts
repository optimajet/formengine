import {calculateExpressionProperty} from '../features/calculation/propertyCalculator'
import type {ComponentStore} from '../stores/ComponentStore'
import {isFunctionalProperty} from '../stores/ComponentStore'
import type {IFormData} from './IFormData'

/**
 * Returns true if the component should be rendered, false otherwise.
 * @param componentStore the component settings.
 * @param formData the form data.
 * @returns true if the component should be rendered, false otherwise.
 */
export function needRender(componentStore: ComponentStore, formData: IFormData) {
  if (!componentStore.renderWhen) return true

  if (!isFunctionalProperty(componentStore.renderWhen)) {
    const {value} = componentStore.renderWhen
    if (typeof value === 'string' && value.trim() === '') return true
  }

  return calculateExpressionProperty(componentStore.renderWhen, formData) === true
}
