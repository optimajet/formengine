import {ActionDefinition} from './ActionDefinition'
import type {ActionValues} from './ActionValues'

/**
 * Converts the input object to an ActionValues object. **Internal use only.**
 * @param obj the input object.
 * @returns the converted ActionValues object.
 */
export const createActionValuesFromObject = (obj: any) => {
  const result: ActionValues = {}
  if (!obj) return result

  Object.keys(obj).forEach(key => {
    const value = obj[key]
    result[key] = ActionDefinition.createFromObject(value)
  })
  return result
}
