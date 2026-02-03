import en from '@vueform/vueform/locales/en'
import {defineConfig, email, min, regex, required} from '@vueform/vueform/src/core.js'

import {main} from './booking-form.ts'

import {
  CheckboxElement,
  classes,
  columns,
  DateElement,
  DatepickerWrapper,
  ElementAddon,
  ElementAddonOptions,
  ElementDescription,
  ElementError,
  StaticElement,
  ElementInfo,
  ElementLabel,
  ElementLabelFloating,
  ElementLayout,
  ElementLayoutInline,
  ElementLoader,
  ElementMessage,
  ElementRequired,
  ElementText,
  FormElements,
  FormErrors,
  FormMessages,
  FormStep,
  FormSteps,
  FormStepsControl,
  FormStepsControls,
  MultiselectElement,
  SelectElement,
  TextareaElement,
  TextElement,
  Vueform,
} from '@vueform/vueform/themes/vueform'

import '@vueform/vueform/themes/vueform/css/index.min.css'

const vueform = {
  templates: {
    Vueform,
    FormElements,
    FormErrors,
    FormMessages,
    FormSteps,

    FormStep,
    StaticElement,
    FormStepsControls,
    FormStepsControl,
    ElementLayout,
    ElementLayoutInline,
    ElementLoader,
    ElementLabelFloating,
    ElementLabel,
    ElementInfo,
    ElementDescription,
    ElementError,
    ElementRequired,
    ElementMessage,
    ElementText,
    ElementAddon,
    ElementAddonOptions,
    TextElement,
    CheckboxElement,
    DateElement,
    DatepickerWrapper,
    MultiselectElement,
    SelectElement,
    TextareaElement,
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
