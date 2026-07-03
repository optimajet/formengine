/**
 * Type predicate, asserts that the value is a string. **Internal use only.**
 * @param value the value.
 * @returns true if the value is a string, false otherwise.
 */
export function isString(value: any): value is string {
  return typeof value === 'string'
}
