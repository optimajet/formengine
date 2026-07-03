import {BuilderView} from '@react-form-builder/core'
import {MuiViewerWrapper} from './components/MuiViewerWrapper'
import {materialUiComponentsDescriptions} from './i18n/materialUiComponentsDescriptions'
import {muiBuilderComponents} from './muiComponents'

/**
 * An assembled set of Material UI components metadata, ready to be passed as a property to the FormBuilder.
 */
export const builderView = new BuilderView(muiBuilderComponents)
  .withViewerWrapper(MuiViewerWrapper)
  .withComponentLibraryDescription(materialUiComponentsDescriptions)
