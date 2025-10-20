import {isRecord} from './index'
import {isUndefined} from './tools'

const mergeArrays = (generatedData: unknown[], initialData: unknown[]) => {
  const result = [...generatedData]

  generatedData.forEach((item, index) => {
    if (index in initialData) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      result[index] = mergeValues(item, initialData[index])
    }
  })

  return result
}

type ValueType = Record<string, unknown> | unknown[] | unknown | undefined

const isMergeableObject = (value: any): value is Record<string, unknown> => {
  return !(!isRecord(value) || value instanceof Date)
}

const mergeValues = (generatedData: ValueType, initialData: ValueType) => {
  if (Array.isArray(generatedData)) {
    return Array.isArray(initialData) ? mergeArrays(generatedData, initialData) : generatedData
  }

  if (Array.isArray(initialData)) return generatedData

  if (isMergeableObject(generatedData) && isMergeableObject(initialData)) {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return mergeData(generatedData, initialData)
  }

  return generatedData
}

/**
 * Merges two data objects.
 * @param generatedData the object with generated data.
 * @param initialData the object with initial data.
 * @returns the object with the result of the merge.
 */
export const mergeData = (generatedData: Record<string, unknown>, initialData: Record<string, unknown>) => {
  const result: Record<string, unknown> = {...generatedData}

  Object.keys(initialData).forEach(key => {
    if (key in generatedData) {
      // we need to save the `undefined` from the generated form data,
      // because the value `undefined` means that the value is cleared and should not be replaced
      // with data from the initial data.
      if (isUndefined(generatedData[key])) return

      result[key] = mergeValues(generatedData[key], initialData[key])
      return
    }

    result[key] = initialData[key]
  })
  return result
}
