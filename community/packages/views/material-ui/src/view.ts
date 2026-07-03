import {createView} from '@react-form-builder/core'
import {MuiViewerWrapper} from './components/MuiViewerWrapper'
import {models} from './models'

/**
 * An assembled set of Material UI components, ready to be passed as a property to the FormViewer.
 */
export const view = createView(models)
  .withViewerWrapper(MuiViewerWrapper)
