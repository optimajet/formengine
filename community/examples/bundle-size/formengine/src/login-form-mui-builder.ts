import {buildForm} from '@react-form-builder/core'

export const loginForm = buildForm({errorType: 'MuiErrorWrapper'})
  .component('email', 'MuiTextField')
  .prop('label', 'Email')
  .prop('placeholder', 'Enter your email')
  .style({display: 'flex', width: '100%'})
  .validation('required')
  .validation('email')

  .component('password', 'MuiTextField')
  .prop('label', 'Password')
  .prop('placeholder', 'Enter your password')
  .prop('type', 'password')
  .style({display: 'flex', width: '100%'})
  .validation('required')
  .validation('min')
  .args({limit: 6})

  .component('rememberMe', 'MuiCheckbox')
  .prop('label', 'Remember me')
  .prop('checked', true)

  .component('submit', 'MuiButton')
  .prop('children', 'Login')
  .prop('variant', 'contained')
  .prop('color', 'primary')
  .event('onClick')
  .commonAction('validate')
  .args({failOnError: true})
  .customAction('onSubmit')

  .json()
