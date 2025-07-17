/**
 * The React component property.
 */
export type ReactProperty = {
  /**
   * The value property name.
   */
  readonly propertyName: string
  /**
   * @returns the property value.
   */
  readonly propertyValue: unknown
}

/**
 * The component properties context type.
 */
export type ComponentPropertiesContext = {
  /**
   * The value property.
   */
  readonly valueProperty?: ReactProperty
}
