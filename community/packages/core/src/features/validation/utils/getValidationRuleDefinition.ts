import type {FormViewerValidationRules} from '../../../stores/FormViewerValidationRules'
import type {CustomValidationRuleSettings} from '../types/CustomValidationRuleSettings'
import type {ValidationRule} from '../types/ValidationRule'
import type {ValidationRuleSettings} from '../types/ValidationRuleSettings'
import type {ValidatorType} from '../types/ValidatorType'

/**
 * The validation rule definition resolved from {@link FormViewerValidationRules}.
 */
type ResolvedValidationRuleDefinition =
  | { type: 'internal', definition: ValidationRule }
  | { type: 'custom', definition: CustomValidationRuleSettings }

const unhandledValidatorType = (_type: never): undefined => undefined

/**
 * Returns the validation rule definition for the persisted rule settings.
 * @param rules the validation rules for the component value type.
 * @param settings the persisted validation rule settings.
 * @returns the rule definition when found, otherwise undefined.
 */
export function getValidationRuleDefinition(
  rules: FormViewerValidationRules,
  settings: ValidationRuleSettings
): ResolvedValidationRuleDefinition | undefined {
  const validatorType: ValidatorType = settings.type ?? 'internal'
  switch (validatorType) {
    case 'internal': {
      const definition = rules.internal[settings.key]
      return definition ? {type: 'internal', definition} : undefined
    }
    case 'custom': {
      const definition = rules.custom?.[settings.key]
      return definition ? {type: 'custom', definition} : undefined
    }
    default:
      return unhandledValidatorType(validatorType)
  }
}
