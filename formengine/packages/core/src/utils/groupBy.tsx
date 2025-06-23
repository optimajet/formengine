/**
 * Groups the array of values by function predicate. **Internal use only.**
 * @param array the array of values.
 * @param predicate the function that returns a string to group the values of the array.
 * @returns the Record with grouped values.
 */
export function groupBy<T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) {
  return array.reduce((acc, value, index, array) => {
    (acc[predicate(value, index, array)] ||= []).push(value)
    return acc
  }, {} as Record<string, T[]>)
}
