import {todayIso, tomorrowIso} from '@react-form-builder/bundle-size-shared/utils'
import {rsButton} from '@react-form-builder/components-rsuite/button'
import {rsCheckbox} from '@react-form-builder/components-rsuite/checkbox'
import {rsContainer} from '@react-form-builder/components-rsuite/container'
import {rsDatePicker} from '@react-form-builder/components-rsuite/date-picker'
import {rsDropdown} from '@react-form-builder/components-rsuite/dropdown'
import {rsErrorMessage} from '@react-form-builder/components-rsuite/error-message'
import {rsImage} from '@react-form-builder/components-rsuite/image'
import {rsInput} from '@react-form-builder/components-rsuite/input'
import {rsStaticContent} from '@react-form-builder/components-rsuite/static-content'
import {rsTagPicker} from '@react-form-builder/components-rsuite/tag-picker'
import {rsTextArea} from '@react-form-builder/components-rsuite/text-area'
import {rsWizard, rsWizardStep} from '@react-form-builder/components-rsuite/wizard'
import {createView, FormViewer} from '@react-form-builder/core'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'

import '@react-form-builder/components-rsuite/css/rsuite-no-reset.min.css'
import '@react-form-builder/components-rsuite/css/formengine-rsuite.css'

import '@react-form-builder/bundle-size-shared/index.css'
import {bookingForm} from './booking-form.ts'

import {actions, formValidators} from './utils'

const components = [
  rsContainer,
  rsInput,
  rsButton,
  rsErrorMessage,
  rsDatePicker,
  rsDropdown,
  rsCheckbox,
  rsTagPicker,
  rsTextArea,
  rsWizard,
  rsWizardStep,
  rsImage,
  rsStaticContent,
].map(def => def.build().model)

const viewWithCss = createView(components)

const getForm = () => bookingForm

const initialData = {
  'check-in-date': todayIso(),
  'check-out-date': tomorrowIso(),
  'number-of-guests': 2,
  'room-type': 'queen',
  'non-smoking': false,
  'number-of-rooms': 1,
  'with-pets': false,
  extras: [],
  notes: '',
  'last-name': '',
  'first-name': '',
}

const App = () => (
  <FormViewer view={viewWithCss} getForm={getForm} actions={actions} formValidators={formValidators} initialData={initialData} />
)

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
