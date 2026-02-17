/**
 * Deduplicates data array by value.
 * @param values array of ComboboxItem objects.
 * @returns deduplicated array.
 */
export function deduplicateData<T>(values: T): T {
  if (!Array.isArray(values)) return values

  const seen = new Set()
  return values.reduce((acc, item) => {
    if (!item.value) {
      return acc
    }

    if (!seen.has(item.value) && item.value.trim() !== '') {
      seen.add(item.value)
      acc.push(item)
    }

    return acc
  }, [] as T)
}
