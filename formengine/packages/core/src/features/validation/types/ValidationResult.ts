import type {ValidationRuleSettings} from './ValidationRuleSettings'

/**
 * The result of the validation.
 */
export type ValidationResult = {

  /**
   * The validation rule settings.
   */
  settings: ValidationRuleSettings

  /**
   * The validation error message text.
   */
  message?: string
}

/**
 * The validation result messages map.
 */
export type MessagesMap = Record<string, string[] | Record<string, string[] | any>>

/**
 * The validation result messages.
 */
export type ValidationMessages = string[] | MessagesMap | undefined
