import {z} from 'zod'
import {isNull, isUndefined} from '../../../utils/tools'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {required} from '../utils/util'
import {zodAnyToValidator} from './zodAnyToValidator'

const scheme = z.number()

export const ZodNumberRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.refine(val => !isUndefined(val) && !isNull(val), required(message)))),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodAnyToValidator(scheme.min(limit, message))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodAnyToValidator(scheme.max(limit, message))),

  lessThan: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({value, message}) => zodAnyToValidator(scheme.lt(value, message))),

  moreThan: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({message, value}) => zodAnyToValidator(scheme.gt(value, message))),

  integer: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.int(message))),

  multipleOf: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({message, value}) => zodAnyToValidator(scheme.multipleOf(value, message))),

  finite: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.finite(message)))
}
