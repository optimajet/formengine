import {z} from 'zod'
import {isNull, isUndefined} from '../../../utils/tools'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorMapForUndefined, requiredMessage} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

const scheme = z.number(errorMapForUndefined)
const isFiniteAndNotEmpty = z.number({
  error: ({input}) => {
    if (isUndefined(input) || isNull(input)) return requiredMessage
    if (!isFinite(input as number)) return 'Invalid number: must be finite'
  }
})

export const ZodNumberRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme)),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodTypeToValidator(scheme.min(limit, message))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodTypeToValidator(scheme.max(limit, message))),

  lessThan: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({value, message}) => zodTypeToValidator(scheme.lt(value, message))),

  moreThan: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({message, value}) => zodTypeToValidator(scheme.gt(value, message))),

  integer: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(z.int(errorMapForUndefined))),

  multipleOf: ruleBuilder()
    .withParameter('value', 'number', true)
    .withValidatorFactory(({message, value}) => zodTypeToValidator(scheme.multipleOf(value, message))),

  /**
   * @deprecated
   */
  finite: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(isFiniteAndNotEmpty))
}
