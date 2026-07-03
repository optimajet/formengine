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
  const href = (await import('../public/css/rsuite-ltr.css?url')).default
  await loadResource(resourceIds[BiDi.LTR], href, 'stylesheet')
  unloadResource(resourceIds[BiDi.RTL])

  return () => {
    return new Promise<void>(resolve => {
      unloadResource(resourceIds[BiDi.LTR])
      resolve()
    })
  }
}

/**
 * Loads the Right-to-Left (RTL) CSS for the "rsuite" library.
 * @returns the Promise that resolves when the RTL CSS has been loaded successfully.
 */
export const rtlCssLoader = async () => {
  const href = (await import('../public/css/rsuite-rtl.css?url')).default
  await loadResource(resourceIds[BiDi.RTL], href, 'stylesheet')
  unloadResource(resourceIds[BiDi.LTR])

  return () => {
    return new Promise<void>(resolve => {
      unloadResource(resourceIds[BiDi.RTL])
      resolve()
    })
  }
}
