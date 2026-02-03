import type {Vueform} from '@vueform/vueform'
import {defineComponent, h, resolveComponent} from 'vue'
import {loginSchema} from './login-schema.ts'

export const handleSubmit = (form: Vueform) => {
  console.warn('Form data', form?.data)
  return false
}

export const LoginApp = defineComponent({
  name: 'Login',
  setup() {
    return {
      loginSchema,
      handleSubmit,
    }
  },

  render() {
    const VueformComponent = resolveComponent('Vueform')

    return [
      h('h2', 'Login Form'),
      h(VueformComponent, {
        schema: this.loginSchema,
        onSubmit: this.handleSubmit,
        endpoint: false,
      }),
    ]
  },
})
