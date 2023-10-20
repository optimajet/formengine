import {
  ltrCssLoader,
  rsErrorMessage,
  RsLocalizationWrapper,
  rsTooltip,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite'
import {BiDi} from '@react-form-builder/core'
import {BuilderView, FormBuilder} from '@react-form-builder/designer'
import React from 'react'
import * as SampleForm from './SampleForm.json'

const builderComponents = rSuiteComponents.map(c => c.build())
const builderView = new BuilderView(builderComponents)
  .withErrorMeta(rsErrorMessage.build())
  .withTooltipMeta(rsTooltip.build())
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)

const getForm = (_?: string) => JSON.stringify(SampleForm)

export const FormBuilderExample = () => {
  return <FormBuilder view={builderView} formName="SampleForm" getForm={getForm}/>
}
