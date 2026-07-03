import type {ValidationRuleSettings} from './ValidationRuleSettings'

/**
 * Value validation rules.
 */
export type BoundValueSchema = {
  /**
   * Flag, if true then automatic validation of the value works, false otherwise.
   */
  autoValidate?: boolean
  /**
   * The array of validation rule settings.
   */
  validations?: ValidationRuleSettings[]
}
