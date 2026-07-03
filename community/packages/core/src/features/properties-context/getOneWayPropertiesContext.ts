import {dataKey} from '../../stores/ComponentStore'
import type {ComponentData} from '../../utils/contexts/ComponentDataContext'
import type {ComponentPropertiesContext} from './ComponentPropertiesContext'

/**
 * Returns a property context with one-way data binding.
 * @param componentData the component data.
 * @returns the property context with one-way data binding.
 */
export const getOneWayPropertiesContext = (componentData: ComponentData): ComponentPropertiesContext => {
  return {
    get valueProperty() {
      const {model, store} = componentData
      // the data is bound only if the dataKey is present
      if (store.disableDataBinding?.value === true
        || !model.valued
        || !store.dataKey) {
        return undefined
      }

      return {
        propertyName: model.valued,
        get propertyValue() {
          const key = dataKey(store)
          return componentData.dataRoot.data[key]
        }
      }
    }
  }
}
