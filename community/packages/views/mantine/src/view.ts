import {createView} from '@react-form-builder/core'
import {MtViewerWrapper} from './components/MtViewerWrapper'
import {models} from './models'

/**
 * An assembled set of Mantine components, ready to be passed as a property to the FormViewer.
 */
export const view = createView(models)
  .withViewerWrapper(MtViewerWrapper)
