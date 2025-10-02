import {BiDi, BuilderView} from '@react-form-builder/core'
import {RsLocalizationWrapper} from './components/RsLocalizationWrapper'
import {formEngineRsuiteCssLoader, ltrCssLoader, rtlCssLoader} from './cssLoader'
import {components} from './models'

/**
 * An assembled set of rSuite components metadata, ready to be passed as a property to the FormBuilder.
 * This view contains CSS loaders.
 */
export const builderViewWithCss = new BuilderView(components)
  .withTemplates([])
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)
