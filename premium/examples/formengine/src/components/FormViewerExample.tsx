import {
  rsErrorMessage,
  RsLocalizationWrapper,
  rSuiteComponents,
} from '@react-form-builder/components-rsuite'
import {createView, FormViewer} from '@react-form-builder/core'
import * as SampleForm from './SampleForm.json'

import '@react-form-builder/core/assets/styles.css'
import '@react-form-builder/components-rsuite/assets/styles.ltr.css'

const viewerComponents = rSuiteComponents.map(c => c.build().model)
viewerComponents.push(rsErrorMessage.build().model)

const view = createView(viewerComponents)
  .withViewerWrapper(RsLocalizationWrapper)

const getForm = (_?: string) => JSON.stringify(SampleForm)

/**
 * @returns the FormViewer example page component.
 */
export const FormViewerExample = () =>
  <div style={{margin: 20}}>
    <FormViewer view={view} formName="SampleForm" getForm={getForm}/>
  </div>
