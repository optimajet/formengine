import type {RuleValidator} from './RuleValidator'

/**
 * The validation function factory.
 * @param args the factory arguments.
 * @returns the function that checks the value and returns the result of the rule validation
 * @template Params the factory arguments type.
 */
export type ValidatorFactory<Params> = (args: Params) => RuleValidator
