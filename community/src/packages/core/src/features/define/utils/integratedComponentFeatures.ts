import {registerBooleanComponentFeature, registerComponentFeature} from './ComponentFeature'

/**
 * A component feature that indicates that the component is a preset.
 */
export const cfComponentIsPreset = 'component-is-preset'
registerBooleanComponentFeature(cfComponentIsPreset)

/**
 * A component feature that allows you to assign roles to a component, such as label, tooltip, etc.
 */
export const cfComponentRole = 'component-role'
registerComponentFeature({
  name: cfComponentRole,
  allowMultiple: true,
})

/**
 * Enabling this component feature will hide the main component's property editors, except for the key property and additional properties.
 */
export const cfDisableMainComponentProperties = 'disable-main-component-properties'
registerBooleanComponentFeature(cfDisableMainComponentProperties)

/**
 * Enabling this component feature will hide the component tooltip properties editor.
 */
export const cfDisableTooltipProperties = 'disable-tooltip-properties'
registerBooleanComponentFeature(cfDisableTooltipProperties)

/**
 * Enabling this component feature will hide the properties editor on the styles tab.
 */
export const cfDisableStyleProperties = 'disable-style-properties'
registerBooleanComponentFeature(cfDisableStyleProperties)

/**
 * Enabling this component feature will hide the component's additional properties editor.
 */
export const cfDisableAdditionalProperties = 'disable-additional-properties'
registerBooleanComponentFeature(cfDisableAdditionalProperties)

/**
 * Enabling this component feature will hide the 'Styles for className' editor.
 */
export const cfDisableStylesForClassNameEditor = 'disable-styles-for-classname-editor'
registerBooleanComponentFeature(cfDisableStylesForClassNameEditor)

/**
 * Enabling this component feature will show the 'Inline styles' editor.
 */
export const cfEnableInlineStylesEditor = 'enable-inline-styles-editor'
registerBooleanComponentFeature(cfEnableInlineStylesEditor)

/**
 * Enabling this component feature will hide it from the component palette.
 */
export const cfHideFromComponentPalette = 'hide-from-component-palette'
registerBooleanComponentFeature(cfHideFromComponentPalette)
