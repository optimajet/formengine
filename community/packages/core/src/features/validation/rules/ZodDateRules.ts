import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorForUndefined, zodErrorParams} from './consts'
import {z} from './zodMini'
import {toRuleValidator} from './zodRuleBuilders'

/**
 * Preserves historical date bound messages (Date#toString boundaries).
 * Check-level issues do not inherit the schema error map, so min/max pass this as a fallback.
 * @param issue zod error.
 * @returns string message.
 */
const dateBoundError: z.core.$ZodErrorMap = (issue) => {
  const undefinedResult = errorForUndefined(issue)
  if (undefinedResult) return undefinedResult

  const {code, origin, maximum, minimum} = issue

  if ((code === 'too_small' || code === 'too_big') && origin === 'date') {
    const boundary = code === 'too_small' ? minimum : maximum
    const value = new Date(boundary as number).toString()

    if (code === 'too_small') {
      return `Too small: expected date to be >=${value}`
    }

    return `Too big: expected date to be <=${value}`
  }
}

const scheme = z.date({error: dateBoundError})

export const ZodDateRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(scheme, z.refine(val => val))),

  min: ruleBuilder()
    .withParameter('value', 'date', true)
    .withValidatorFactory(({value, message}) =>
      toRuleValidator(scheme, z.gte(new Date(value), zodErrorParams(message, dateBoundError)))),

  max: ruleBuilder()
    .withParameter('value', 'date', true)
    .withValidatorFactory(({value, message}) =>
      toRuleValidator(scheme, z.lte(new Date(value), zodErrorParams(message, dateBoundError)))),
}
