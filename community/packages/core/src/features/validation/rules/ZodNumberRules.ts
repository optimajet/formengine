import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorForUndefined, zodErrorParams} from './consts'
import {z} from './zodMini'
import {numberScheme, toRuleValidator} from './zodRuleBuilders'

export const ZodNumberRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(numberScheme)),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => toRuleValidator(numberScheme, z.gte(limit, zodErrorParams(message)))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => toRuleValidator(numberScheme, z.lte(limit, zodErrorParams(message)))),

  lessThan: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({value, message}) => toRuleValidator(numberScheme, z.lt(value, zodErrorParams(message)))),

  moreThan: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({message, value}) => toRuleValidator(numberScheme, z.gt(value, zodErrorParams(message)))),

  integer: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(z.int({error: errorForUndefined}))),

  multipleOf: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({message, value}) => toRuleValidator(numberScheme, z.multipleOf(value, zodErrorParams(message)))),
}
