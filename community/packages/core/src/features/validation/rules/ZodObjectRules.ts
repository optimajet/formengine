import {z} from 'zod'
import {isEmpty, isObject} from '../../../utils/tools'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {requiredMessage} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

const scheme = z.union([z.looseObject({}), z.string()])

export const ZodObjectRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(z.unknown().refine(val => isObject(val) && !isEmpty(val), requiredMessage))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(({message}) => zodTypeToValidator(scheme.refine(arg => arg, message)))
}
