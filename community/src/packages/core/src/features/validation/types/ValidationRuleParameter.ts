import type {SchemaType} from './SchemaType'

/**
 * Describes the settings of the validation rule parameter.
 */
export type ValidationRuleParameter = {
  /**
   * The unique setting key of the parameter.
   */
  key: string
  /**
   * The type of value.
   */
  type: SchemaType,
  /**
   * Flag whether the setting value must be filled in.
   */
  required: boolean
  /**
   * The default value.
   */
  default?: unknown
  /**
   * The editor type of the setting value.
   */
  editorType?: string
}
