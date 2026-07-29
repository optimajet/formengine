import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from '../utils/ruleBuilder'
import {requiredMessage, zodErrorParams} from './consts'
import {z} from './zodMini'
import {pipeStringScheme, stringScheme, toRuleValidator} from './zodRuleBuilders'

const invalidIpMessage = 'Invalid ip'

export const ZodStringRules: ValidationRuleSet = {
  required: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(stringScheme, z.minLength(1, {error: requiredMessage}))),

  nonEmpty: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(stringScheme, z.minLength(1))),

  length: ruleBuilder()
    .withParameter('length', 'number', true)
    .withValidatorFactory(({length, message}) => toRuleValidator(stringScheme, z.length(length, zodErrorParams(message)))),

  min: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => toRuleValidator(stringScheme, z.minLength(limit, zodErrorParams(message)))),

  max: ruleBuilder()
    .withParameter('limit', 'number', true)
    .withValidatorFactory(({limit, message}) => toRuleValidator(stringScheme, z.maxLength(limit, zodErrorParams(message)))),

  regex: ruleBuilder()
    .withParameter('regex', 'string', true)
    .withValidatorFactory(({message, regex}) => toRuleValidator(stringScheme, z.regex(new RegExp(regex), zodErrorParams(message)))),

  email: ruleBuilder()
    .withValidatorFactory(({message}) => toRuleValidator(pipeStringScheme(z.email(zodErrorParams(message))))),

  url: ruleBuilder()
    .withValidatorFactory(({message}) => toRuleValidator(pipeStringScheme(z.url(zodErrorParams(message))))),

  uuid: ruleBuilder()
    .withValidatorFactory(({message}) => toRuleValidator(pipeStringScheme(z.uuid(zodErrorParams(message))))),

  ip: ruleBuilder()
    .withValidatorFactory(() => toRuleValidator(pipeStringScheme(z.union([z.ipv4(), z.ipv6()], {error: invalidIpMessage})))),

  datetime: ruleBuilder()
    .withParameter('precision', 'number')
    .withParameter('offset', 'boolean')
    .withValidatorFactory(({message, offset, precision}) => toRuleValidator(pipeStringScheme(z.iso.datetime({
      offset,
      precision,
      ...zodErrorParams(message),
    })))),

  includes: ruleBuilder()
    .withParameter('value', 'string', true)
    .withParameter('position', 'number')
    .withValidatorFactory(({message, value, position}) => toRuleValidator(stringScheme, z.includes(value, {
      position,
      ...zodErrorParams(message),
    }))),

  startsWith: ruleBuilder()
    .withParameter('value', 'string', true)
    .withValidatorFactory(({message, value}) => toRuleValidator(stringScheme, z.startsWith(value, zodErrorParams(message)))),

  endsWith: ruleBuilder()
    .withParameter('value', 'string', true)
    .withValidatorFactory(({message, value}) => toRuleValidator(stringScheme, z.endsWith(value, zodErrorParams(message)))),
}
