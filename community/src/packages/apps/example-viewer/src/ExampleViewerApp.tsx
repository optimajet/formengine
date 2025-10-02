import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  rsButton,
  rsContainer,
  rsDatePicker,
  rsErrorMessage,
  rsInput,
  RsLocalizationWrapper
} from '@react-form-builder/components-rsuite'
import {BiDi, buildForm, createView, FormViewer} from '@react-form-builder/core'
import {useMemo} from 'react'

const simpleForm = buildForm({errorType: 'RsErrorMessage'})
  .component('container', 'RsContainer')
  .style({flexDirection: 'row'})
  .children((builder) =>
    builder
      .component('firstName', 'RsInput')
      .prop('placeholder', 'Enter your first name')
      .prop('label', 'First Name')
      .validation('required')

      .component('lastName', 'RsInput')
      .prop('placeholder', 'Enter your last name')
      .prop('label', 'Last Name')
      .validation('required')
  )

  .component('birthDate', 'RsDatePicker')
  .prop('label', 'Birth Date')
  .prop('oneTap', true)
  .validation('min').args({value: '1900-01-07T12:25:37.000Z'})

  .component('submit', 'RsButton')
  .prop('children', 'Submit')
  .prop('color', 'blue')
  .prop('appearance', 'primary')
  .event('onClick')
  .commonAction('validate').args({failOnError: true})
  .customAction('onSubmit')
  .json()

// Utility functions that don't depend on component state
const getForm = () => simpleForm
const onSubmit = (e: any) => {
  // submit the form to the backend
  alert('Form data: ' + JSON.stringify(e.data))
}

const components = [rsContainer, rsInput, rsButton, rsDatePicker, rsErrorMessage]
  .map(def => def.build().model)

const viewWithCss = createView(components)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)

/**
 * @returns the App element.
 */
export const ExampleViewerApp = () => {
  const actions = useMemo(() => ({onSubmit}), [])

  return <FormViewer
    view={viewWithCss}
    getForm={getForm}
    actions={actions}
  />
}
