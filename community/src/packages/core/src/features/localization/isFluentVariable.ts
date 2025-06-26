import type {FluentVariable} from '@fluent/bundle/esm/bundle'
import type {FluentType} from '@fluent/bundle/esm/types.js'

/**
 * The type checker for the {@link FluentVariable} type.
 * @param value the value to check.
 * @returns true if the value is a {@link FluentVariable} type, false otherwise.
 */
export const isFluentVariable = (value: any): value is FluentVariable => {
  if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
    return true
  }

  return typeof (value as FluentType<unknown>)?.value !== 'undefined'
}
