import type {ComponentData} from '../../utils/contexts/ComponentDataContext'
import type {ComponentPropertiesContext} from './ComponentPropertiesContext'
import {emptyPropertiesContext} from './emptyPropertiesContext'
import {getFieldPropertiesContext} from './getFieldPropertiesContext'
import {getOneWayPropertiesContext} from './getOneWayPropertiesContext'

/**
 * Returns a default property context.
 * @param componentData the component data.
 * @returns a default property context.
 */
export const getDefaultPropertiesContext = (componentData: ComponentData): ComponentPropertiesContext => {
  const {model, field} = componentData
  if (!model.valued || model.dataBindingType === 'none') return emptyPropertiesContext

  if (model.dataBindingType === 'oneWay') {
    return getOneWayPropertiesContext(componentData)
  }

  return field ? getFieldPropertiesContext(field, model) : emptyPropertiesContext
}
