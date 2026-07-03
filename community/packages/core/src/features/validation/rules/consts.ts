import type z from 'zod'
import {isNull, isUndefined} from '../../../utils/tools'

export const requiredMessage = 'Required'
/**
 * Zod error for undefined value.
 * @param issue zod issue.
 * @returns message object or undefined.
 */
export const errorForUndefined: z.core.$ZodErrorMap = (issue) => {
  const {input} = issue

  if (isUndefined(input) || isNull(input)) return {message: requiredMessage}
}
