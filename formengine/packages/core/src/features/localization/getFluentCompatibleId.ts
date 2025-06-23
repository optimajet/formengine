/**
 * Converts the raw id to a Fluent compatible id, i.e. replaces all the spaces with underscores. **Internal use only.**
 * @param rawId some raw id.
 * @returns the Fluent compatible id.
 */
export const getFluentCompatibleId = (rawId: string) => {
  return rawId.replace(new RegExp(' ', 'g'), '_')
}
