/**
 * Replaces placeholders for rSuite localisation.
 * @param obj the object in which you want to change the placeholders.
 * @returns the patched object.
 */
export function patchPlaceholders(obj: any) {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      obj[key] = value.replaceAll('{{0}}', '{0}')
    }
    if (typeof value === 'object') {
      patchPlaceholders(value)
    }
  })
  return obj
}
