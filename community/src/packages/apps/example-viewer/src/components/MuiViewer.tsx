import RawMuiForm from '@react-form-builder/apps-common/forms/MuiForm.json'
import {view} from '@react-form-builder/components-material-ui'
import {FormViewer} from '@react-form-builder/core'

const getForm = () => JSON.stringify(RawMuiForm)

/**
 * @returns the MUI Form viewer.
 */
export const MuiViewer = () => {
  return <FormViewer view={view} getForm={getForm} />
}
