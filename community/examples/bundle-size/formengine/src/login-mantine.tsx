import {MantineProvider} from '@mantine/core'
import {mtButton} from '@react-form-builder/components-mantine/button'
import {mtCheckbox} from '@react-form-builder/components-mantine/checkbox'
import {mtErrorWrapper} from '@react-form-builder/components-mantine/errorWrapper'
import {mtPasswordInput} from '@react-form-builder/components-mantine/passwordInput'
import {mtTextInput} from '@react-form-builder/components-mantine/textInput'
import {createView, FormViewer} from '@react-form-builder/core'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'

import '@mantine/core/styles/baseline.css'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/global.css'
import '@mantine/core/styles/ActionIcon.css'
import '@mantine/core/styles/Button.css'
import '@mantine/core/styles/Checkbox.css'
import '@mantine/core/styles/Input.css'
import '@mantine/core/styles/SimpleGrid.css'
import '@mantine/core/styles/Title.css'
import '@mantine/core/styles/PasswordInput.css'
import '@react-form-builder/bundle-size-shared/index.css'

import {loginFormMantine} from './login-form-mantine.ts'
import {actions} from './utils.tsx'

const components = [mtTextInput, mtPasswordInput, mtButton, mtCheckbox, mtErrorWrapper].map(def => def.build().model)

const view = createView(components)

const getForm = () => loginFormMantine

const App = () => (
  <MantineProvider>
    <FormViewer view={view} getForm={getForm} actions={actions} />
  </MantineProvider>
)

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
