import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rtlCssLoader
} from '@react-form-builder/components-rsuite'
import {ActionDefinition, BiDi, ComponentData, debounce, IFormData, RuleValidatorResult, Validators} from '@react-form-builder/core'
import {BuilderView, FormBuilder, IFormStorage} from '@react-form-builder/designer'
import {useMemo} from 'react'
import {Schema} from 'yup'
import form from './form.json'
import {useBookingForm} from './useBookingForm'
import * as validator from './validators'

const componentsMetadata = rSuiteComponents.map(definer => definer.build())

const formName = 'formikForm'

const formStorage: IFormStorage = {
  getForm: async () => localStorage.getItem(formName) || JSON.stringify(form),
  saveForm: async (_, form) => localStorage.setItem(formName, form),
  getFormNames: () => Promise.resolve([formName]),
  removeForm: () => Promise.resolve()
}

const loadForm = () => formStorage.getForm('')

const builderView = new BuilderView(componentsMetadata)
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

const toFormEngineValidate = (yupValidator: typeof Schema.prototype) => async (value: unknown): Promise<RuleValidatorResult> => {
  let err: RuleValidatorResult = true
  try {
    await yupValidator.validate(value)
  } catch (e) {
    err = (e as Error).message
  }
  return err
}

const customValidators: Validators = {
  'string': {
    'isFullName': {
      validate: toFormEngineValidate(validator.fullName)
    },
  },
  'date': {
    'dateInTheFuture': {
      validate: toFormEngineValidate(validator.dateTodayOrInTheFuture)
    }
  },
  'number': {
    'checkGuestCount': {
      validate: toFormEngineValidate(validator.checkGuestsCount)
    }
  }
}

function App() {
  const [formik] = useBookingForm()

  const setFormikValues = useMemo(() => debounce(async (form: IFormData) => {
    const {fields} = form as ComponentData

    for (const [key, {value, error}] of fields) {
      const field = formik.getFieldProps(key)
      if (value !== field.value) {
        try {
          await formik.setFieldValue(key, value)
          formik.setFieldError(key, error)
        } catch (e) {
          console.warn(e)
        }
      }
    }
  }, 400), [formik])

  return <FormBuilder
    view={builderView}
    formStorage={formStorage}
    initialData={formik.values}
    onFormDataChange={setFormikValues}
    validators={customValidators}
    customization={customization}
    getForm={loadForm}
    actions={{
      submitForm: ActionDefinition.functionalAction(async (e) => {
        try {
          await e.store.formData.validate()
        } catch (e) {
          console.warn(e)
        }
        if (Object.keys(e.store.formData.errors).length < 1) {
          await formik.submitForm()
        }
      })
    }}
  />
}

export default App
