import {rsButton} from '@react-form-builder/components-rsuite/button'
import {rsCheckbox} from '@react-form-builder/components-rsuite/checkbox'
import {rsContainer} from '@react-form-builder/components-rsuite/container'
import {rsErrorMessage} from '@react-form-builder/components-rsuite/error-message'
import {rsInput} from '@react-form-builder/components-rsuite/input'
import {createView, type CustomActions, FormViewer} from '@react-form-builder/core'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'

import '@react-form-builder/components-rsuite/css/rsuite-no-reset.min.css'
import '@react-form-builder/components-rsuite/css/formengine-rsuite.css'

import '@react-form-builder/bundle-size-shared/index.css'
import {loginForm} from './login-form.ts'

const components = [rsContainer, rsInput, rsButton, rsCheckbox, rsErrorMessage].map(def => def.build().model)

const viewWithCss = createView(components)

const getForm = () => loginForm

export const actions: CustomActions = {
  onSubmit: (e: {data: unknown}) => {
    console.warn('Login data', e.data)
  },
}

const App = () => <FormViewer view={viewWithCss} getForm={getForm} actions={actions} />

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
