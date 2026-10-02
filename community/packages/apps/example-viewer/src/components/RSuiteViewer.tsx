import {printModels} from '@react-form-builder/components-print'
import {ltrCssLoader, models, RsViewWrapper, rtlCssLoader} from '@react-form-builder/components-rsuite'
import {BiDi, createView, FormViewer} from '@react-form-builder/core'
import {useMemo} from 'react'

import simpleForm from '../forms/rsuiteViewerForm.json?raw'

const view = createView([...models, ...printModels])
  .withViewerWrapper(RsViewWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)

const getForm = () => simpleForm
const onSubmit = (e: any) => {
  alert('Form data: ' + JSON.stringify(e.data))
}

/**
 * @returns the RSuite Form builder.
 */
export const RSuiteViewer = () => {
  const actions = useMemo(() => ({onSubmit}), [])
  return <FormViewer view={view} getForm={getForm} actions={actions} />
}
