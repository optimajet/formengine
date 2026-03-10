import Form from '@rjsf/mantine'
import {MantineProvider} from '@mantine/core'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './login-form.tsx'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App formComponent={Form} />
    </MantineProvider>
  </StrictMode>
)
