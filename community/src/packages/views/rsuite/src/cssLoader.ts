import {BiDi, loadResource, unloadResource} from '@react-form-builder/core'

const resourceIds: Record<BiDi, string> = {
  [BiDi.LTR]: 'rsuite-ltr-css',
  [BiDi.RTL]: 'rsuite-rtl-css'
}

/**
 * Loads the Left-To-Right (LTR) CSS for the "rsuite" library.
 * @returns the Promise that resolves when the LTR CSS has been loaded successfully.
 */
export const ltrCssLoader = async () => {
  const href = (await import('../public/css/rsuite-no-reset.min.css?url')).default
  await loadResource(resourceIds[BiDi.LTR], href, 'stylesheet')
  unloadResource(resourceIds[BiDi.RTL])
}

/**
 * Loads the Right-to-Left (RTL) CSS for the "rsuite" library.
 * @returns the Promise that resolves when the RTL CSS has been loaded successfully.
 */
export const rtlCssLoader = async () => {
  const href = (await import('../public/css/rsuite-no-reset-rtl.min.css?url')).default
  await loadResource(resourceIds[BiDi.RTL], href, 'stylesheet')
  unloadResource(resourceIds[BiDi.LTR])
}

/**
 * Loads FormEngine specific styles over "rsuite" library.
 * @returns the Promise that resolves when the custom styles have been loaded successfully.
 */
export const formEngineRsuiteCssLoader = async () => {
  const href = (await import('../public/css/formengine-rsuite.css?url')).default
  await loadResource('form-engine-css', href, 'stylesheet')
}
