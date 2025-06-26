/**
 * Generates a unique name with the specified prefix. **Internal use only.**
 * @param prefix the prefix.
 * @param existingNames the set of existing names to match with which uniqueness will be checked.
 * @returns the generated name.
 */
export function generateUniqueName(prefix: string, existingNames: Set<string>) {
  let i = 1
  while (i < 10_000) {
    const name = `${prefix}${i}`
    if (!existingNames.has(name)) return name
    i++
  }
  const time = new Date().getTime()
  return `${prefix}_${time}`
}
