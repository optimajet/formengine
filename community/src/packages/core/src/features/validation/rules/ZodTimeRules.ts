import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {required} from '../utils/util'
import {zodAnyToValidator} from './zodAnyToValidator'

export const ZodTimeRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(z.string({required_error: required(message)}).nonempty(required(message))))
}
