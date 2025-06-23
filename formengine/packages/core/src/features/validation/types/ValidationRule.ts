import type {ValidationRuleParameter} from './ValidationRuleParameter'
import type {ValidatorFactory} from './ValidatorFactory'

/**
 * Validation rule metadata required to create a validation function.
 */
export type ValidationRule = {

  /**
   * Metadata of validation rule parameters.
   */
  params?: ValidationRuleParameter[]

  /**
   * The validation function factory.
   */
  validatorFactory: ValidatorFactory<any>
}
