import {z} from 'zod'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {errorMapForUndefined, requiredMessage} from './consts'
import {zodTypeToValidator} from './zodTypeToValidator'

const scheme = z.string(errorMapForUndefined)
const withScheme = (secondScheme: z.ZodSchema) => z.intersection(scheme, secondScheme)
const invalidIpMessage = 'Invalid ip'

export const ZodStringRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme.nonempty(requiredMessage))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(scheme.nonempty())),

  length: ruleBuilder()
    .withParameter('length', 'number', true)
    .withValidatorFactory(({length, message}) => zodTypeToValidator(scheme.length(length, message))),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodTypeToValidator(scheme.min(limit, message))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => zodTypeToValidator(scheme.max(limit, message))),

  regex: ruleBuilder()
    .withParameter('regex', 'string', true)
    .withValidatorFactory(({message, regex}) => zodTypeToValidator(scheme.regex(new RegExp(regex), message))),

  email: ruleBuilder()
    .withValidatorFactory(({message}) => zodTypeToValidator(withScheme(z.email(message)))),

  url: ruleBuilder()
    .withValidatorFactory(({message}) => zodTypeToValidator(withScheme(z.url(message)))),

  uuid: ruleBuilder()
    .withValidatorFactory(({message}) => zodTypeToValidator(withScheme(z.uuid(message)))),

  ip: ruleBuilder()
    .withValidatorFactory(() => zodTypeToValidator(withScheme(z.union([z.ipv4(), z.ipv6()], invalidIpMessage)))),

  datetime: ruleBuilder()
    .withParameter('precision', 'number')
    .withParameter('offset', 'boolean')
    .withValidatorFactory(({message, offset, precision}) => zodTypeToValidator(withScheme(z.iso.datetime({message, offset, precision})))),

  includes: ruleBuilder()
    .withParameter('value', 'string', true)
    .withParameter('position', 'number')
    .withValidatorFactory(({message, value, position}) => zodTypeToValidator(scheme.includes(value, {message, position}))),

  startsWith: ruleBuilder()
    .withParameter('value', 'string', true)
    .withValidatorFactory(({message, value}) => zodTypeToValidator(scheme.startsWith(value, message))),

  endsWith: ruleBuilder()
    .withParameter('value', 'string', true)
    .withValidatorFactory(({message, value}) => zodTypeToValidator(scheme.endsWith(value, message)))
}
