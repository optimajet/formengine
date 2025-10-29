import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorMapForUndefined} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

const scheme = z.date(errorMapForUndefined)

export const ZodDateRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme.refine(val => val))),

  min: ruleBuilder()
    .withParameter('value', 'date', true)
    .withValidatorFactory(({value, message}) => zodTypeToValidator(scheme.min(new Date(value), message))),

  max: ruleBuilder()
    .withParameter('value', 'date', true)
    .withValidatorFactory(({value, message}) => zodTypeToValidator(scheme.max(new Date(value), message)))
}
