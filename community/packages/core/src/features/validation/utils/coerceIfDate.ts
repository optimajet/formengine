import type {SchemaType} from '../types/SchemaType'
import {parseDate} from './parseDate'

/**
 * Returns the value as a Date when the type is date and conversion succeeds.
 * @param type the value type.
 * @param value the value to coerce.
 * @returns the Date when conversion succeeds, otherwise the original value.
 */
export function coerceIfDate(type: SchemaType | undefined, value: unknown): unknown {
  if (type !== 'date') return value
  return parseDate(value) ?? value
}
