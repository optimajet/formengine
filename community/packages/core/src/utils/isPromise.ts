/**
 * Type predicate, asserts that the value is a Promise. **Internal use only.**
 * @param value the value.
 * @returns true if the value is a Promise, false otherwise.
 */
export function isPromise<T = any>(value: any): value is Promise<T> {
  return typeof value === 'object' && typeof value.then === 'function'
}
