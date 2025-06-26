import type {PropertyKey} from '../../event'
import type {SchemaType} from '../types/SchemaType'
import type {SchemaTypeMap} from '../types/SchemaTypeMap'
import type {ValidationRule} from '../types/ValidationRule'
import type {ValidationRuleParameter} from '../types/ValidationRuleParameter'
import type {ValidatorFactory} from '../types/ValidatorFactory'

/**
 * The key-value pair for a value type.
 */
export type Pair<Key, Type extends SchemaType> = { [k in keyof Key]: SchemaTypeMap[Type] }

/**
 * The type-safe rule builder.
 */
export type ValidationRuleBuilder<Params> = {
  /**
   * The validation rule parameters.
   */
  params: ValidationRuleParameter[],
  /**
   * Adds a parameter to the validation rule.
   */
  withParameter: <T extends SchemaType = 'string', Key = any>(key: PropertyKey<Key>,
                                                              type?: T,
                                                              required?: boolean,
                                                              defaultValue?: SchemaTypeMap[T],
                                                              editorType?: string) => ValidationRuleBuilder<Params & Pair<Key, T>>
  /**
   * Sets the validation rule factory.
   */
  withValidatorFactory: (apply: ValidatorFactory<Params>) => ValidationRule
}

/**
 * @returns the {@link ValidationRuleBuilder} with the 'message' parameter.
 */
export function ruleBuilder() {
  const builder = {
    params: [],
    withParameter(key, type?, required = false,
                  defaultValue?, editorType?): ValidationRuleBuilder<any> {
      this.params.push({key, type: type ?? 'string', required, default: defaultValue, editorType})
      return this
    },
    withValidatorFactory(validatorFactory) {
      return {...this, validatorFactory}
    }
  } as ValidationRuleBuilder<{}>
  return builder.withParameter('message')
}
