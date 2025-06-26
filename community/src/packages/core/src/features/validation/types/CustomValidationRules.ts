import type {CustomValidationRuleSettings} from './CustomValidationRuleSettings'
import type {SchemaType} from './SchemaType'

/**
 * A set of metadata of custom validation rules, grouped by rule name.
 */
export type CustomValidationRules = Record<string, CustomValidationRuleSettings>

/**
 * The set of metadata of custom validation rules, grouped by the type of value being validated.
 */
export type Validators = Partial<Record<SchemaType, CustomValidationRules>>
