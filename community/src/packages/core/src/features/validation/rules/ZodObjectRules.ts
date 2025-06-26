import {isEmpty} from 'lodash-es'
import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {required} from '../utils/util'
import {zodAnyToValidator} from './zodAnyToValidator'

const scheme = z.union([z.object({}).passthrough(), z.string()])

export const ZodObjectRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(z.unknown().refine(val => !isEmpty(val), required(message)))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.refine(arg => arg, message)))
}
