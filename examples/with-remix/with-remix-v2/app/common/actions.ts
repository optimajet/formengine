import {ActionDefinition} from '@react-form-builder/core'

export const actions = {
  submitForm: ActionDefinition.functionalAction(async (e) => {
    try {
      await e.store.formData.validate()
    } catch (e) {
      console.warn(e)
    }
    if (Object.keys(e.store.formData.errors).length < 1) {
      console.log(e.store.formData.data)
    } else {
      console.error(e.store.formData.errors)
    }
  })
}

