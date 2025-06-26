import {FormBuilder, IFormStorage} from '@react-form-builder/designer'
import {actions} from '~/common/actions.js'
import {customValidators} from '~/common/validators.js'

import form from '~/common/form.json'

import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rsErrorMessage,
  rtlCssLoader, rsTooltip
} from '@react-form-builder/components-rsuite'
import {BiDi, BuilderView} from '@react-form-builder/core'

const components = [...rSuiteComponents, rsErrorMessage]
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
  .withErrorMeta(rsErrorMessage.build())
  .withTooltipMeta(rsTooltip.build())
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)

  .withErrorMeta(rsErrorMessage.build())
  .withTooltipMeta(rsTooltip.build())

// We're hiding the form panel because it's not fully functional in this example
const customization = {
  Forms_Tab: {
    hidden: true
  }
}

export default function BuilderClient() {
  return <div className="h-screen">
    <FormBuilder
      view={view}
      actions={actions}
      formName={formName}
      getForm={loadForm}
      validators={customValidators}
      customization={customization}
      onFormSchemaChange={console.log}
    />
  </div>
}
