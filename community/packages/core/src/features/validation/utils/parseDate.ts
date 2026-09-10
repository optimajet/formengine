import {isString} from '../../../utils/isString'
import {isDate, isNumber} from '../../../utils/tools'

/**
 * Parses a value as a Date.
 * @param value the value to parse.
 * @returns the Date when the value is a valid date string, timestamp, or Date, otherwise undefined.
 */
export function parseDate(value: unknown): Date | undefined {
  if (isDate(value)) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }
  if (!isString(value) && !isNumber(value)) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}
