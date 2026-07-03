import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorForUndefined} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

const scheme = z.number({error: errorForUndefined})

export const ZodNumberRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme)),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodTypeToValidator(scheme.min(limit, message))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodTypeToValidator(scheme.max(limit, message))),

  lessThan: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({value, message}) => zodTypeToValidator(scheme.lt(value, message))),

  moreThan: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({message, value}) => zodTypeToValidator(scheme.gt(value, message))),

  integer: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(z.int({error: errorForUndefined}))),

  multipleOf: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({message, value}) => zodTypeToValidator(scheme.multipleOf(value, message))),
}
