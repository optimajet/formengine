import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite'
import {BiDi} from '@react-form-builder/core'
import {BuilderView, FormBuilder} from '@react-form-builder/designer'
import * as SampleForm from './SampleForm.json'

const builderComponents = rSuiteComponents.map(c => c.build())
const builderView = new BuilderView(builderComponents)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)

const getForm = (_?: string) => JSON.stringify(SampleForm)

const divStyle = {height: '100vh'}

/**
 * @returns the FormBuilder example page component.
 */
export const FormBuilderExample = () => (
  <div style={divStyle}>
    <FormBuilder view={builderView} formName="SampleForm" getForm={getForm}/>
  </div>
)
