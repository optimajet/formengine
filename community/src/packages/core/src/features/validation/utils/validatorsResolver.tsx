import type {FormViewerValidationRules} from '../../../stores/FormViewerValidationRules'
import {isPromise} from '../../../utils'
import {needValidate} from '../../../utils/needValidate'
import {isUndefined} from '../../../utils/tools'
import type {BoundValueSchema} from '../types/BoundValueSchema'
import type {RuleValidator} from '../types/RuleValidator'
import type {ValidationResult} from '../types/ValidationResult'
import type {ValidationRuleParameter} from '../types/ValidationRuleParameter'
import type {ValidationRuleSettings} from '../types/ValidationRuleSettings'
import type {ResolvedValidator} from './DataValidator'

type ValidatorWithSettings = {
  settings: ValidationRuleSettings,
  validator: RuleValidator
  params?: ValidationRuleParameter[]
}

//The 'required' rule must be implemented first, because it is a root for next
//The 'code' rule (used refine under the hood) must be implemented last
function byPriority(_: ValidationRuleSettings, b: ValidationRuleSettings) {
  if (b.key === 'code') return -1
  if (b.key === 'required') return 1
  return 0
}

const noOpValidator = () => true

function parse(validationRules: FormViewerValidationRules, schema?: BoundValueSchema): ValidatorWithSettings[] | undefined {
  if (!schema || !schema.validations || !schema.validations.length) return

  const rules = [...schema.validations].sort(byPriority)
  const toValidator = (rule: ValidationRuleSettings) => {
    if (!rule.type || rule.type === 'internal') {
      const definition = validationRules.internal[rule.key]
      if (!definition) {
        console.warn(`Cannot find 'internal' rule, key: '${rule.key}'`)
        return {settings: rule, validator: noOpValidator}
      }
      const validator = definition.validatorFactory(rule.args ?? {})
      return {settings: rule, validator, params: definition.params}
    }
    if (rule.type === 'custom') {
      const definition = validationRules.custom?.[rule.key]
      if (definition) return {settings: rule, validator: definition.validate, params: definition.params}
    }
    console.warn(`Cannot find rule, key: '${rule.key}', type: '${rule.type}'`)
    return {settings: rule, validator: noOpValidator}
  }

  return rules.map(toValidator)
}

/**
 * Creates a validator for the specified value validation rules.
 * @param validationRules the validation rules for FormViewer.
 * @param schema the value validation rules.
 * @returns the validation function.
 */
function validatorsResolver(validationRules: FormViewerValidationRules, schema?: BoundValueSchema): ResolvedValidator {
  const validators = parse(validationRules, schema)

  return async (value, store, getFormData) => {
    if (!validators) return

    const validationResults: ValidationResult[] = []
    for (const {settings, validator, params} of validators) {
      const args: Record<string, unknown> = {}
      if (!needValidate(settings.validateWhen, getFormData?.())) continue

      params?.filter(param => !isUndefined(param.default))
        .map(param => args[param.key] = param.default)
      Object.assign(args, settings.args)
      const result = validator(value, store, args, getFormData?.())
      const ruleResult = isPromise(result) ? await result : result
      if (ruleResult !== true) {
        validationResults.push({
          settings: settings,
          message: (args.message ?? ruleResult) as string
        })
      }
    }
    return validationResults
  }
}

/**
 * Returns the function that creates a validator for the value.
 * @param validationRules the validation rules for FormViewer.
 * @returns the function that creates a validator for the value.
 */
export function typedValidatorsResolver(validationRules: FormViewerValidationRules) {
  return function (schema?: BoundValueSchema) {
    return validatorsResolver(validationRules, schema)
  }
}
