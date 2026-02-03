import Form from '@rjsf/core'
import {type ButtonHTMLAttributes, StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './booking-form.tsx'

import 'bootstrap/dist/css/bootstrap.min.css'

import '@react-form-builder/bundle-size-shared/index.css'

import './booking.css'

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} className="btn btn-info" />

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App formComponent={Form} button={Button} />
  </StrictMode>
)
