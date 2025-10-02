import {BiDi, createView} from '@react-form-builder/core'
import {RsLocalizationWrapper} from './components/RsLocalizationWrapper'
import {formEngineRsuiteCssLoader, ltrCssLoader, rtlCssLoader} from './cssLoader'
import {models} from './models'

/**
 * An assembled set of rSuite components, ready to be passed as a property to the FormViewer.
 * This view contains CSS loaders.
 */
export const viewWithCss = createView(models)
  // The following parameters are required for correct CSS loading in LTR and RTL modes
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)
