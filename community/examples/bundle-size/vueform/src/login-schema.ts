import {ref} from 'vue'

export const loginSchema = ref({
  email: {
    type: 'text',
    inputType: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    rules: ['required', 'email'],
  },
  password: {
    type: 'text',
    inputType: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    rules: ['required', 'min:6'],
  },
  rememberMe: {
    type: 'checkbox',
    text: 'Remember me',
    default: true,
  },
  submit: {
    type: 'button',
    buttonLabel: 'Login',
    submits: true,
    full: true,
    size: 'lg',
  },
})
