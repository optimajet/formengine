import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {required} from '../utils/util'
import {zodAnyToValidator} from './zodAnyToValidator'

const scheme = z.date()

export const ZodDateRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.refine(val => val, required(message)))),

  min: ruleBuilder()
    .withParameter('value', 'date', true)
    .withValidatorFactory(({value, message}) => zodAnyToValidator(scheme.min(new Date(value), message))),

  max: ruleBuilder()
    .withParameter('value', 'date', true)
    .withValidatorFactory(({value, message}) => zodAnyToValidator(scheme.max(new Date(value), message)))
}
