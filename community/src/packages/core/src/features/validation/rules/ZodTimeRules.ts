import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorMapForUndefined} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

export const ZodTimeRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(z.string(errorMapForUndefined).nonempty()))
}
