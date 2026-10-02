// import RawMantineForm from '@react-form-builder/apps-common/forms/MantineForm-all.json'
import RawMantineForm from '@react-form-builder/apps-common/forms/MantineForm.json'
import {MtViewerWrapper, models} from '@react-form-builder/components-mantine'
import {printModels} from '@react-form-builder/components-print'
import {createView, FormViewer} from '@react-form-builder/core'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

const getForm = () => JSON.stringify(RawMantineForm)

const view = createView([...models, ...printModels]).withViewerWrapper(MtViewerWrapper)

/**
 * @returns the MUI Form viewer.
 */
export const MantineViewer = () => {
  return <FormViewer view={view} getForm={getForm} />
}
