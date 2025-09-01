'use client'

import {actions} from '@/app/common/actions'
import form from '@/app/common/form.json'
import {customValidators} from '@/app/common/validators'
import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite'
import {BiDi, BuilderView} from '@react-form-builder/core'
import {IFormStorage} from '@react-form-builder/designer'
import dynamic from 'next/dynamic'

const FormBuilder = dynamic(() => import('@react-form-builder/designer').then((mod) => mod.FormBuilder), {
  ssr: false
})

const components = [...rSuiteComponents]
  .map(definer => definer.build())

const formName = 'nextForm'

const formStorage: IFormStorage = {
  getForm: async () => localStorage.getItem(formName) || JSON.stringify(form),
  saveForm: async (_, form) => localStorage.setItem(formName, form),
  getFormNames: () => Promise.resolve([formName]),
  removeForm: () => Promise.resolve()
}

const loadForm = () => formStorage.getForm('')

const view = new BuilderView(components)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)

// We're hiding the form panel because it's not fully functional in this example
const customization = {
  Forms_Tab: {
    hidden: true
  }
}

export default function Builder() {
  return (
    <FormBuilder
      view={view}
      actions={actions}
      formName={formName}
      getForm={loadForm}
      validators={customValidators}
      customization={customization}
    />
  )
}
