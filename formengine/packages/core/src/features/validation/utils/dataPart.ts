import {isNumber, isRecord, isString} from '../../../utils'

/**
 * Returns data (array element or object field) by key.
 * @param data the data.
 * @param key the key.
 * @returns the projection.
 */
export function dataPart(data: unknown, key: string | number): unknown {
  if (Array.isArray(data) && isNumber(key)) return data[key]
  if (isRecord(data) && isString(key)) return data[key]
  return undefined
}
