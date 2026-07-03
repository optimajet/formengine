import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'

/**
 * Creates a proxy for form data.
 * @param componentData the form element.
 * @returns the proxy for form data.
 */
export function createDataProxy(componentData: ComponentData): Record<string, unknown> {
  return new Proxy({}, {
    get(_, property: string) {
      if (property === 'toJSON') return () => componentData.data
      return componentData.data[property]
    },
    set(_, property: string, value): boolean {
      let valueFoundInFields = false

      componentData.allComponentFields
        .filter(({dataKey}) => dataKey === property)
        .forEach(({field}) => {
          valueFoundInFields = true
          field.setValue(value)
        })

      if (!valueFoundInFields) {
        componentData.updateInitialData(property, value)
      }

      return true
    },
    ownKeys(): ArrayLike<string | symbol> {
      return Reflect.ownKeys(componentData.data)
    },
    getOwnPropertyDescriptor(_, key: string) {
      return Object.getOwnPropertyDescriptor(componentData.data, key)
    },
  })
}
