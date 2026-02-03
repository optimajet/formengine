/**
 * The component property value type.
 */
export type ComponentPropertyComputeType = 'function' | 'localization'

/**
 * The value of the component property.
 * @template T the value type.
 */
export interface ComponentProperty<T = any> {
  /**
   * The simple value of a component property.
   */
  value?: T
  /**
   * Source code of the function for calculating the value of a component property.
   */
  fnSource?: string
  /**
   * Type of the component's calculated property. If not specified - the value from value is used.
   */
  computeType?: ComponentPropertyComputeType

  /**
   * The component property editor type, only used in Designer mode.
   */
  editorType?: string
}
