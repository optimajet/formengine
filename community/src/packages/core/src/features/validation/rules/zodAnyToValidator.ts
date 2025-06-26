import type {ZodTypeAny} from 'zod'
import type {RuleValidator} from '../types/RuleValidator'

/**
 * Converts {@link ZodTypeAny} to {@link RuleValidator}.
 * @param zodValidator the {@link ZodTypeAny} instance.
 * @returns the {@link RuleValidator} instance.
 */
export function zodAnyToValidator(zodValidator: ZodTypeAny): RuleValidator {
  return async value => {
    const result = await zodValidator?.safeParseAsync(value)
    if (result?.success) return true
    return result?.error.issues?.[0].message ?? false
  }
}
