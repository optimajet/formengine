/**
 * CSS styles for a device.
 */
export type DeviceStyle = {

  /**
   * CSS styles defined in the general style settings.
   */
  object?: any

  /**
   * CSS styles defined in the style code editor.
   */
  string?: string
}

/**
 * The type for the CSS property of a React component.
 */
export type Css = {

  /**
   * CSS styles for arbitrary device.
   */
  any?: DeviceStyle

  /**
   * CSS styles for mobile devices.
   */
  mobile?: DeviceStyle

  /**
   * CSS styles for tablet devices.
   */
  tablet?: DeviceStyle

  /**
   * CSS styles for desktop devices.
   */
  desktop?: DeviceStyle
}

/**
 * The part of the CSS properties of a component.
 */
export type CssPart = 'css' | 'wrapperCss'
