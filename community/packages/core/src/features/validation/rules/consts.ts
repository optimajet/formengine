import {isNull, isUndefined} from '../../../utils/tools'
import type {z} from './zodMini'

export const requiredMessage = 'Required'

/**
 * Builds Zod 4 check params from an optional custom message.
 * @param message custom validation message.
 * @param fallback error string or map used when message is not set.
 * @returns error params, or undefined when neither message nor fallback is set.
 */
export const zodErrorParams = (
  message?: string,
  fallback?: string | z.core.$ZodErrorMap,
): { error: string | z.core.$ZodErrorMap } | undefined => {
  if (message) return {error: message}
  if (fallback !== undefined) return {error: fallback}
}

/**
 * Zod error for undefined value.
 * @param issue zod issue.
 * @returns the error message or undefined.
 */
export const errorForUndefined: z.core.$ZodErrorMap = (issue) => {
  const {input} = issue

  if (isUndefined(input) || isNull(input)) return requiredMessage
}
