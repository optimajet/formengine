import {viewWithCss} from '@react-form-builder/components-rsuite'
import {FormViewer} from '@react-form-builder/core'
import {useMemo} from 'react'

import simpleForm from '../forms/rsuiteViewerForm.json?raw'

const getForm = () => simpleForm
const onSubmit = (e: any) => {
  alert('Form data: ' + JSON.stringify(e.data))
}

/**
 * @returns the RSuite Form builder.
 */
export const RSuiteViewer = () => {
  const actions = useMemo(() => ({onSubmit}), [])
  return <FormViewer view={viewWithCss} getForm={getForm} actions={actions} />
}
