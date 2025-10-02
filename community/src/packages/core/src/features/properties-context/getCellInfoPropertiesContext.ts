import type {Store} from '../../stores/Store'
import type {Setter} from '../../types'
import type {ComponentData} from '../../utils/contexts/ComponentDataContext'
import type {CellInfo} from '../table/CellInfo'
import type {SchemaType} from '../validation'
import {DataValidator} from '../validation'
import type {ErrorMessageLocalizer} from '../validation/utils/DataValidator'
import {ProxyField} from '../validation/utils/ProxyField'
import {typedValidatorsResolver} from '../validation/utils/validatorsResolver'
import type {ComponentPropertiesContext} from './ComponentPropertiesContext'
import {emptyPropertiesContext} from './emptyPropertiesContext'
import {getFieldPropertiesContext} from './getFieldPropertiesContext'

const createProxyFieldDataValidator = (viewerStore: Store,
                                       componentData: ComponentData,
                                       valueType: SchemaType,
                                       onError: Setter<string | undefined>) => {
  const validationRules = viewerStore.getValidationRules(valueType)
  const localizer: ErrorMessageLocalizer = (validationResults) => {
    return viewerStore.localizeErrorMessages(componentData.dataRoot, componentData.store, validationResults)
  }
  return DataValidator.create(
    viewerStore,
    () => componentData.dataRoot,
    typedValidatorsResolver(validationRules),
    componentData.store.schema,
    onError,
    localizer
  )
}

/**
 * Returns the context of the component properties for the row element.
 * @param componentData the data required to display a component.
 * @param cellInfo the information about a cell.
 * @param viewerStore the form viewer settings.
 * @returns the context of the component properties for the row element.
 */
export const getCellInfoPropertiesContext = (componentData: ComponentData,
                                             cellInfo: CellInfo,
                                             viewerStore: Store): ComponentPropertiesContext => {
  const {store, model} = componentData
  const valued = model.valued
  if (!valued || model.dataBindingType === 'none') return emptyPropertiesContext

  if (model.dataBindingType === 'oneWay') {
    return {
      get valueProperty() {
        if (store.disableDataBinding?.value === true) return undefined

        return {
          propertyName: valued,
          get propertyValue() {
            const {dataKey, rowData} = cellInfo
            return dataKey ? rowData?.[dataKey] : undefined
          }
        }
      },
      cellInfo: cellInfo
    }
  }

  const proxyValueGetter = () => cellInfo.dataKey ? cellInfo.rowData?.[cellInfo.dataKey] : undefined

  const proxyValueSetter = (value: unknown) => {
    if (cellInfo.dataKey && cellInfo.rowData) {
      cellInfo.rowData[cellInfo.dataKey] = value
    }
  }

  const createDataValidator = (valueType: SchemaType, onError: Setter<string | undefined>) => {
    return createProxyFieldDataValidator(viewerStore, componentData, valueType, onError)
  }

  const field = new ProxyField(
    proxyValueGetter,
    proxyValueSetter,
    createDataValidator,
    store,
    model,
    false
  )

  return getFieldPropertiesContext(field, model, cellInfo)
}
