import type {ComponentProperty} from '../../../stores/ComponentStore'
import type {ValidatorType} from './ValidatorType'

/**
 * The validation rule settings.
 */
export type ValidationRuleSettings = {

  /**
   * The unique key of the validation rule. The key is unique within the value type.
   */
  key: string

  /**
   * The type of validator.
   */
  type?: ValidatorType

  /**
   * Arguments of the validation rule.
   */
  args?: Record<string, any>

  /**
   * The property that determines when validation needs to be performed.
   */
  validateWhen?: ComponentProperty
}
