import type {ComponentStore} from '../../../stores/ComponentStore'
import {isFunctionalProperty, isLocalizedProperty} from '../../../stores/ComponentStore'
import type {LocalizationType} from '../../../stores/LocalizationStore'
import type {IFormData} from '../../../utils/IFormData'
import {calculatePropertyValue} from '../../calculation/propertyCalculator'

/**
 * The function to localize the properties of a component.
 */
export type LocalizeComponent = (type: LocalizationType, componentStore: ComponentStore) => Record<string, any>

/**
 * Calculates the property of the component.
 * @param component the component settings.
 * @param key the property key.
 * @param formData the form data.
 * @param localizerComponent the function to localize the properties of a component.
 * @returns the array, where the first element of the array is the sign whether the property was calculated or not,
 * the second element of the array is the calculated value of the property.
 */
export function calculateProperty(component: ComponentStore, key: string,
                                  formData: IFormData, localizerComponent: LocalizeComponent): [boolean, any?] {
  const property = component.props[key]
  if (isFunctionalProperty(property)) {
    const {result} = calculatePropertyValue(property, formData)
    return [true, result]
  }
  if (isLocalizedProperty(property)) {
    const props = localizerComponent('component', component)
    const value = props[key]
    return [true, value]
  }
  return [false]
}
