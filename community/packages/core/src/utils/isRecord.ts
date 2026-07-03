/**
 * Type predicate, asserts that the value is a {@link Record}. **Internal use only.**
 * @param value the value.
 * @returns true if the value is a Record, false otherwise.
 */
export function isRecord(value: any): value is Record<string, unknown> {
  return typeof value === 'object'
}
