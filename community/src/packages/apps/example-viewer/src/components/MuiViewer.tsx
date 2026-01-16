import {view} from '@react-form-builder/components-material-ui'
import {FormViewer} from '@react-form-builder/core'
import RawMuiForm from '../forms/MuiForm.json'

const getForm = () => JSON.stringify(RawMuiForm)

/**
 * @returns the MUI Form builder.
 */
export const MuiViewer = () => {
  return <FormViewer view={view} getForm={getForm} />
}
