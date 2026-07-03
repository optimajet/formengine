import RawMuiForm from '@react-form-builder/apps-common/forms/MuiForm.json'
import '../utils/muiLocalizations'
import {models, MuiLocalizationProvider, MuiViewerWrapper} from '@react-form-builder/components-material-ui'
import {createView, FormViewer} from '@react-form-builder/core'

const view = createView(models).withViewerWrapper(MuiViewerWrapper).withViewerWrapper(MuiLocalizationProvider)

const getForm = () => JSON.stringify(RawMuiForm)

/**
 * @returns the MUI Form viewer.
 */
export const MuiViewer = () => {
  return <FormViewer view={view} getForm={getForm} />
}
