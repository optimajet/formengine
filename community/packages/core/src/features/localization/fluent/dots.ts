import {isString} from '../../../utils/isString'

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

/**
 * Recursively applies {@link replaceDots} to every string in localization payloads (objects and arrays).
 * Authors write regular dots in Fluent (e.g. `{$user.name}`); only the internal Fluent payload uses {@link dotInternalValue}.
 * @param value a localization constant (string, array, object, or primitive).
 * @returns the same structure with all string leaves passed through {@link replaceDots}.
 */
export function replaceDotsDeep(value: unknown): unknown {
  if (isString(value)) {
    return replaceDots(value)
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceDotsDeep(item))
  }
  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(source)) {
      out[k] = replaceDotsDeep(v)
    }
    return out
  }
  return value
}

