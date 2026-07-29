import {RsViewWrapper, view} from '@react-form-builder/components-rsuite'
import {FormViewer} from '@react-form-builder/core'

import '@react-form-builder/core/assets/styles.css'
import '@react-form-builder/components-rsuite/assets/styles.ltr.css'

import form from '../forms/rsuiteViewerForm.json?raw'

const getForm = () => form

const viewWithThemes = view.withViewerWrapper(RsViewWrapper)

/**
 * Form viewer with RSuite components and a static sample form JSON (inputs and validate button).
 * @returns the RSuite JSON sample viewer.
 */
export const RsuiteViewerImportCss = () => {
  return <FormViewer getForm={getForm} view={viewWithThemes} />
}
