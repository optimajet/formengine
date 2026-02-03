import Form from '@rjsf/mui'
import MuiButton from '@mui/material/Button'
import type {ButtonProps as MuiButtonProps} from '@mui/material/Button'
import {type ButtonHTMLAttributes, StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './booking-form.tsx'

import '@react-form-builder/bundle-size-shared/index.css'

import './booking.css'

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const {color, ...restProps} = props
  const muiProps: MuiButtonProps = {
    ...restProps,
    ...(color && typeof color === 'string' && ['error', 'info', 'inherit', 'primary', 'secondary', 'success', 'warning'].includes(color)
      ? {color: color as MuiButtonProps['color']}
      : {}),
  }
  return <MuiButton {...muiProps} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App formComponent={Form} button={Button} />
  </StrictMode>
)
