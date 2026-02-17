import {BuilderView} from '@react-form-builder/core'
import {builderComponents} from './builderComponents'
import {MtViewerWrapper} from './components/MtViewerWrapper'
import {mantineComponentsDescriptions} from './i18n/mantineUiComponentsDescriptions'

/**
 * An assembled set of Mantine components metadata, ready to be passed as a property to the FormBuilder.
 */
export const builderView = new BuilderView(builderComponents)
  .withViewerWrapper(MtViewerWrapper)
  .withComponentLibraryDescription(mantineComponentsDescriptions)
