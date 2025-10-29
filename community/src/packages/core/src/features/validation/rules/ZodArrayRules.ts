import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorMapForUndefined, requiredMessage} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

const scheme = z.array(z.any(), errorMapForUndefined)

export const ZodArrayRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme.nonempty(requiredMessage))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme.nonempty())),

  length: ruleBuilder()
    .withParameter('length', 'number', true)
    .withValidatorFactory(({length, message}) => zodTypeToValidator(scheme.length(length, message))),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodTypeToValidator(scheme.min(limit, message))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodTypeToValidator(scheme.max(limit, message)))
}
