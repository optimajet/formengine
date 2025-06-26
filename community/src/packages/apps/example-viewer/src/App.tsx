import {viewWithCss} from '@react-form-builder/components-rsuite'
import {buildForm, FormViewer} from '@react-form-builder/core'

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

/**
 * @returns the App element.
 */
export const App = () => {
  return <FormViewer
    view={viewWithCss}
    getForm={() => simpleForm}
    actions={{
      onSubmit: (e) => {
        // submit the form to the backend
        alert('Form data: ' + JSON.stringify(e.data))
      },
    }}
  />
}
