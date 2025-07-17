import type {ComponentData} from '../../utils/contexts/ComponentDataContext'
import type {ComponentPropertiesContext} from './ComponentPropertiesContext'
import {getOneWayPropertiesContext} from './getOneWayPropertiesContext'

const emptyContext: ComponentPropertiesContext = {}

/**
 * Returns a default property context.
 * @param componentData the component data.
 * @returns a default property context.
 */
export const getDefaultPropertiesContext = (componentData: ComponentData): ComponentPropertiesContext => {
  const valued = componentData.model.valued
  if (!valued || componentData.model.dataBindingType === 'none') return emptyContext

  if (componentData.model.dataBindingType === 'oneWay') {
    return getOneWayPropertiesContext(componentData)
  }

  if (componentData.model.kind !== 'template' && componentData.field) {
    return {
      valueProperty: {
        propertyName: valued,
        get propertyValue() {
          return componentData.field?.value ?? componentData.model.uncontrolledValue
        }
      }
    }
  }

  return emptyContext
}
