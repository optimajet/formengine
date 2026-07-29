import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {requiredMessage} from './consts'
import {z} from './zodMini'
import {stringScheme, toRuleValidator} from './zodRuleBuilders'

export const ZodTimeRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(stringScheme, z.minLength(1, {error: requiredMessage}))),
}
