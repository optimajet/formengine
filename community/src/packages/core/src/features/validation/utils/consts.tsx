import {AsyncFunction} from '../../../utils/AsyncFunction'
import type {IFormData} from '../../../utils/IFormData'
import {ZodArrayRules} from '../rules/ZodArrayRules'
import {ZodBooleanRules} from '../rules/ZodBooleanRules'
import {ZodDateRules} from '../rules/ZodDateRules'
import {ZodNumberRules} from '../rules/ZodNumberRules'
import {ZodObjectRules} from '../rules/ZodObjectRules'
import {ZodStringRules} from '../rules/ZodStringRules'
import {ZodTimeRules} from '../rules/ZodTimeRules'
import type {SchemaType} from '../types/SchemaType'
import type {ValidationRule} from '../types/ValidationRule'
import type {ValidationRuleSet} from '../types/ValidationRuleSet'
import {ruleBuilder} from './ruleBuilder'

export const ZodValidationRules: Record<SchemaType, ValidationRuleSet> = {
  'string': ZodStringRules,
  'number': ZodNumberRules,
  'boolean': ZodBooleanRules,
  'date': ZodDateRules,
  'time': ZodTimeRules,
  'object': ZodObjectRules,
  'array': ZodArrayRules,
  'enum': {}
}

const emptyCodeValidator = () => Promise.resolve(true)

const getCodeValidator = (code: string) => {
  try {
    return AsyncFunction('value, form', code) as (value: any, form?: IFormData) => Promise<boolean>
  } catch (e) {
    console.error(`Unable to compile the validation function, code:\n${code}\n`, e)
    return emptyCodeValidator
  }
}

export const codeValidationRule: ValidationRule = ruleBuilder()
  .withParameter('code', undefined, true, undefined, 'code')
  .withValidatorFactory(({code, message}) => {
    const checker = getCodeValidator(code)
    return async (value, store, args, formData) => {
      try {
        const result = await checker(value, formData)
        if (result) return true
        return message ?? false
      } catch (e) {
        console.error('Validation error', e)
        throw e
      }
    }
  })
