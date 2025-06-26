import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'
import {ActionDefinition} from '../types'

const parseRowData = (data?: string) => {
  if (!data) return
  try {
    return JSON.parse(data)
  } catch (ignored) {
    return
  }
}

const addRow = (data: Record<string, any>, repeaterKey: string, maxItems?: number,
                rowValue?: string, rowIndex?: number) => {
  const repeaterData = data[repeaterKey] ?? []
  if (typeof maxItems === 'number' && repeaterData.length >= maxItems) return

  const rowData = parseRowData(rowValue) ?? {}
  const modifiedData = [...repeaterData]
  typeof rowIndex === 'number'
    ? modifiedData.splice(rowIndex, 0, rowData)
    : modifiedData.push(rowData)
  data[repeaterKey] = modifiedData
}

const removeRow = (data: Record<string, any>, repeaterKey: string, index: number,
                   minItems?: number) => {
  const repeaterData = data[repeaterKey]
  if (!Array.isArray(repeaterData)) return
  if (typeof minItems === 'number' && repeaterData.length <= minItems) return

  const modifiedData = [...repeaterData]
  modifiedData.splice(index, 1)
  data[repeaterKey] = modifiedData
}

const getParentRepeaterDataKey = (componentData: ComponentData) => {
  const dataRoot = componentData.dataRoot
  if (typeof dataRoot.index === 'number') {
    return dataRoot.store.props?.repeaterDataKey?.value
  }
}

export const addRowAction = ActionDefinition.functionalAction(((e, args) => {
  if (args.dataKey) {
    addRow(e.data, args.dataKey, args.max, args.rowData, args.index)
    return
  }

  const repeaterDataKey = getParentRepeaterDataKey(e.sender)
  if (repeaterDataKey && e.parentData) {
    addRow(e.parentData, repeaterDataKey, args.max, args.rowData, args.index)
  }
}), {
  dataKey: 'string',
  rowData: 'string',
  index: 'number',
  max: 'number',
})

export const removeRowAction = ActionDefinition.functionalAction(((e, args) => {
  // delete the last row by default
  const index = args.index ?? e.index ?? -1

  if (args.dataKey) {
    removeRow(e.data, args.dataKey, index, args.min)
    return
  }

  const repeaterDataKey = getParentRepeaterDataKey(e.sender)
  if (repeaterDataKey && e.parentData) {
    removeRow(e.parentData, repeaterDataKey, index, args.min)
  }
}), {
  dataKey: 'string',
  index: 'number',
  min: 'number',
})
