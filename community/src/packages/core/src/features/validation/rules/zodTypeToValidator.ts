import type {ZodType} from 'zod'
import type {RuleValidator} from '../types/RuleValidator'

/**
 * Converts {@link ZodType} to {@link RuleValidator}.
 * @param zodValidator the {@link ZodType} instance.
 * @returns the {@link RuleValidator} instance.
 */
export function zodTypeToValidator(zodValidator: ZodType): RuleValidator {
  return async value => {
    const result = await zodValidator?.safeParseAsync(value)
    if (result?.success) return true
    return result?.error.issues?.[0].message ?? false
  }
}
