import Form from '@rjsf/mantine'
import {Button, MantineProvider} from '@mantine/core'
import {type ButtonHTMLAttributes, StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './booking-form.tsx'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@react-form-builder/bundle-size-shared/index.css'

import './booking.css'

const MantineButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const {type = 'button', ...restProps} = props
  return <Button {...restProps} type={type} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <App formComponent={Form} button={MantineButton} />
    </MantineProvider>
  </StrictMode>
)
