import en from '@vueform/vueform/locales/en'
import {defineConfig, email, min, regex, required} from '@vueform/vueform/src/core.js'

import {
  ButtonElement,
  CheckboxElement,
  classes,
  columns,
  ElementDescription,
  ElementError,
  ElementInfo,
  ElementLabel,
  ElementLabelFloating,
  ElementLayout,
  ElementLayoutInline,
  ElementMessage,
  ElementRequired,
  ElementText,
  FormElements,
  FormErrors,
  FormMessages,
  TextElement,
  Vueform,
} from '@vueform/vueform/themes/material'

import '@vueform/vueform/themes/material/css/index.min.css'
import {main} from './login-form.ts'

const vueform = {
  templates: {
    Vueform,
    FormElements,
    FormErrors,
    FormMessages,
    ElementLayout,
    ButtonElement,
    ElementLayoutInline,
    ElementLabelFloating,
    ElementError,
    ElementDescription,
    ElementLabel,
    ElementInfo,
    ElementRequired,
    ElementMessage,
    ElementText,
    TextElement,
    CheckboxElement,
  },
  classes,
  columns,
}

const vueformConfig = defineConfig({
  theme: vueform,
  locales: {en},
  locale: 'en',
  rules: {
    required,
    email,
    min,
    regex,
  },
})

main(vueformConfig)
