import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorForUndefined} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

const legacyDateError: z.core.$ZodErrorMap = (issue) => {
  const undefinedResult = errorForUndefined(issue)
  if (undefinedResult) return undefinedResult

  const {code, origin, maximum, minimum} = issue

  if ((code === 'too_small' || code === 'too_big') && origin === 'date') {
    const boundary = code === 'too_small' ? minimum : maximum
    const value = new Date(boundary as number).toString()

    if (code === 'too_small') {
      return {
        message: `Too small: expected date to be >=${value}`
      }
    }

    return {
      message: `Too big: expected date to be <=${value}`
    }
  }
}

const scheme = z.date({error: legacyDateError})

export const ZodDateRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme.refine(val => val))),

  min: ruleBuilder()
    .withParameter('value', 'date', true)
    .withValidatorFactory(({value, message}) => {
      return zodTypeToValidator(scheme.min(new Date(value), {error: legacyDateError}))
    }),

  max: ruleBuilder()
    .withParameter('value', 'date', true)
    .withValidatorFactory(({value, message}) => {
      return zodTypeToValidator(scheme.max(new Date(value), {error: legacyDateError}))
    })
}
