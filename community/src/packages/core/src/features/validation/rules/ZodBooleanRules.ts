import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorMapForUndefined, requiredMessage} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

const scheme = z.boolean(errorMapForUndefined)

export const ZodBooleanRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme.refine(val => val, requiredMessage))),

  truthy: ruleBuilder()
    .withValidatorFactory(({message}) => zodTypeToValidator(scheme.refine(arg => arg, message))),

  falsy: ruleBuilder()
    .withValidatorFactory(({message}) => zodTypeToValidator(scheme.refine(arg => !arg, message)))
}
