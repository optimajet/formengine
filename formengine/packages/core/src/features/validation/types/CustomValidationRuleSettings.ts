import type {RuleValidator} from './RuleValidator'
import type {ValidationRuleParameter} from './ValidationRuleParameter'

/**
 * Custom validation rule settings.
 */
export type CustomValidationRuleSettings = {

  /**
   * Metadata of validation rule parameters.
   */
  params?: ValidationRuleParameter[]

  /**
   * The function that validates the value.
   */
  validate: RuleValidator
}
