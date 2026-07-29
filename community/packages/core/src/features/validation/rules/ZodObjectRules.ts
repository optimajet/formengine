import {isEmpty, isObject} from '../../../utils/tools'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {requiredMessage, zodErrorParams} from './consts'
import {z} from './zodMini'
import {toRuleValidator} from './zodRuleBuilders'

const scheme = z.union([z.looseObject({}), z.string()])

/**
 * Object "required" rejects null, undefined, non-objects, and empty objects.
 * Object "nonEmpty" only checks truthiness, so {}, strings, and other truthy values pass.
 */
export const ZodObjectRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(z.unknown(), z.refine(val => isObject(val) && !isEmpty(val), {error: requiredMessage}))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(({message}) => toRuleValidator(scheme, z.refine(arg => arg, zodErrorParams(message)))),
}
