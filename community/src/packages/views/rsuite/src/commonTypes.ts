/**
 * Common CSS block properties.
 */
export interface AreaProps {
  /**
   * The background color.
   */
  backgroundColor?: string
}

/**
 * Common CSS text properties.
 */
export interface TextProps extends AreaProps {
  /**
   * The text alignment.
   */
  alignment?: string
  /**
   * The font size.
   */
  fontSize?: number
  /**
   * The font weight.
   */
  fontWeight?: string
  /**
   * The color.
   */
  color?: string
}
