import type {IStore} from '../../../stores/IStore'
import type {IFormData} from '../../../utils/IFormData'

/**
 * The result of validation of a single rule, true means validation was successful,
 * false means validation failed, string means error message.
 */
export type RuleValidatorResult = string | boolean

/**
 * The function that checks the value and returns the result of the rule validation, see {@link RuleValidatorResult}.
 * @param value the value.
 * @param store the form viewer settings
 * @param args the rule arguments.
 * @param formData the form data.
 * @template T the value type.
 */
export type RuleValidator<T = any> = (value: T,
                                      store: IStore,
                                      args?: Record<string, unknown>,
                                      formData?: IFormData) => RuleValidatorResult | Promise<RuleValidatorResult>
