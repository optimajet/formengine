import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {requiredMessage, zodErrorParams} from './consts'
import {z} from './zodMini'
import {arrayScheme, toRuleValidator} from './zodRuleBuilders'

export const ZodArrayRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(arrayScheme, z.minLength(1, {error: requiredMessage}))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(arrayScheme, z.minLength(1))),

  length: ruleBuilder()
    .withParameter('length', 'number', true)
    .withValidatorFactory(({length, message}) => toRuleValidator(arrayScheme, z.length(length, zodErrorParams(message)))),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => toRuleValidator(arrayScheme, z.minLength(limit, zodErrorParams(message)))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => toRuleValidator(arrayScheme, z.maxLength(limit, zodErrorParams(message)))),
}
