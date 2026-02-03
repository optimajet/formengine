import Form from '@rjsf/mui'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './login-form.tsx'

import '@react-form-builder/bundle-size-shared/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App formComponent={Form} />
  </StrictMode>
)
