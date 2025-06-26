/**
 * The character used to represent a dot.
 */
const dotCharacter = '.'

/**
 * The internal value used to replace dots in object keys.
 */
export const dotInternalValue = '__DOT__'

/**
 * Replaces all dots in the value with a special character.
 * @param value the value to replace the dots.
 * @returns the value with the dots replaced.
 */
export function restoreDots(value: string): string {
  return value.replace(new RegExp(`\\${dotInternalValue}`, 'g'), dotCharacter)
}

/**
 * Replaces all special characters with dots.
 * @param value the value to replace the special characters.
 * @returns the value with the special characters replaced.
 */
export function replaceDots(value: string): string {
  return value.replace(new RegExp(`\\${dotCharacter}`, 'g'), dotInternalValue)
}

