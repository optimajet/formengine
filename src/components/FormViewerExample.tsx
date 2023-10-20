import {ltrCssLoader, rsErrorMessage, RsLocalizationWrapper, rSuiteComponents, rtlCssLoader} from '@react-form-builder/components-rsuite'
import {BiDi, createView, FormViewer} from '@react-form-builder/core'
import React from 'react'
import * as SampleForm from './SampleForm.json'

const viewerComponents = rSuiteComponents.map(c => c.build().model)
viewerComponents.push(rsErrorMessage.build().model)

const view = createView(viewerComponents)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)

const getForm = (_?: string) => JSON.stringify(SampleForm)

export const FormViewerExample = () => {
  return <div style={{margin: 20}}>
    <FormViewer view={view} formName="SampleForm" getForm={getForm}/>
  </div>
}
