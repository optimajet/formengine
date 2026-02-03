import {muiButton} from '@react-form-builder/components-material-ui/button'
import {muiCheckbox} from '@react-form-builder/components-material-ui/checkbox'
import {muiErrorWrapper} from '@react-form-builder/components-material-ui/error-wrapper'
import {muiTextField} from '@react-form-builder/components-material-ui/text-field'
import {createView, FormViewer} from '@react-form-builder/core'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'

import '@react-form-builder/bundle-size-shared/index.css'
import {loginForm} from './login-form-mui.ts'
import {actions} from './utils.tsx'

const components = [muiTextField, muiButton, muiErrorWrapper, muiCheckbox].map(def => def.build().model)

const view = createView(components)

const getForm = () => loginForm

const App = () => <FormViewer view={view} getForm={getForm} actions={actions} />

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
