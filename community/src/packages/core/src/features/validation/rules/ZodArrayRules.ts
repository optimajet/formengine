import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {required} from '../utils/util'
import {zodAnyToValidator} from './zodAnyToValidator'

const scheme = z.array(z.any())

export const ZodArrayRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.nonempty(required(message)))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.nonempty(message))),

  length: ruleBuilder()
    .withParameter('length', 'number', true)
    .withValidatorFactory(({length, message}) => zodAnyToValidator(scheme.length(length, message))),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodAnyToValidator(scheme.min(limit, message))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodAnyToValidator(scheme.max(limit, message)))
}
