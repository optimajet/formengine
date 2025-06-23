import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {required} from '../utils/util'
import {zodAnyToValidator} from './zodAnyToValidator'

const scheme = z.string()

export const ZodStringRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(z.string({required_error: required(message)}).nonempty(required(message)))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.nonempty(message))),

  length: ruleBuilder()
    .withParameter('length', 'number', true)
    .withValidatorFactory(({length, message}) => zodAnyToValidator(scheme.length(length, message))),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodAnyToValidator(scheme.min(limit, message))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodAnyToValidator(scheme.max(limit, message))),

  regex: ruleBuilder()
    .withParameter('regex', 'string', true)
    .withValidatorFactory(({message, regex}) => zodAnyToValidator(scheme.regex(new RegExp(regex), message))),

  email: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.email(message))),

  url: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.url(message))),

  uuid: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.uuid(message))),

  ip: ruleBuilder()
    .withValidatorFactory(({message}) => zodAnyToValidator(scheme.ip(message))),

  datetime: ruleBuilder()
    .withParameter('precision', 'number')
    .withParameter('offset', 'boolean')
    .withValidatorFactory(({message, offset, precision}) => zodAnyToValidator(scheme.datetime({message, offset, precision}))),

  includes: ruleBuilder()
    .withParameter('value', 'string', true)
    .withParameter('position', 'number')
    .withValidatorFactory(({message, value, position}) => zodAnyToValidator(scheme.includes(value, {message, position}))),

  startsWith: ruleBuilder()
    .withParameter('value', 'string', true)
    .withValidatorFactory(({message, value}) => zodAnyToValidator(scheme.startsWith(value, message))),

  endsWith: ruleBuilder()
    .withParameter('value', 'string', true)
    .withValidatorFactory(({message, value}) => zodAnyToValidator(scheme.endsWith(value, message)))
}
