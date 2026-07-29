import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {requiredMessage, zodErrorParams} from './consts'
import {z} from './zodMini'
import {booleanScheme, toRuleValidator} from './zodRuleBuilders'

/**
 * Boolean "required" means the value must be true, not merely present.
 * Both undefined/null and false fail validation.
 */
export const ZodBooleanRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(booleanScheme, z.refine(val => val, {error: requiredMessage}))),

  truthy: ruleBuilder()
    .withValidatorFactory(({message}) => toRuleValidator(booleanScheme, z.refine(arg => arg, zodErrorParams(message)))),

  falsy: ruleBuilder()
    .withValidatorFactory(({message}) => toRuleValidator(booleanScheme, z.refine(arg => !arg, zodErrorParams(message)))),
}
