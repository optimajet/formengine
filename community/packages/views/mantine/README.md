# OptimaJet React Form Builder RSuite components library

This library is part of the [React Form Builder](https://formengine.io/) project.

This package contains visual components based on [Mantine](https://mantine.dev/). To learn how to use the package, see
our [documentation](https://formengine.io/documentation/).

## Install

```bash
npm install @react-form-builder/core @react-form-builder/components-mantine
```

## Quickstart

```typescript jsx
import {view} from '@react-form-builder/components-mantine'
import {buildForm, FormViewer} from '@react-form-builder/core'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'

const simpleForm = buildForm()
  .component('container', 'MtContainer')
  .style({flexDirection: 'row'})
  .children((builder) =>
    builder
      .component('firstName', 'MtTextInput')
      .prop('placeholder', 'Enter your first name')
      .prop('label', 'First Name')
      .validation('required')

      .component('lastName', 'MtTextInput')
      .prop('placeholder', 'Enter your last name')
      .prop('label', 'Last Name')
      .validation('required')
  )

  .component('birthDate', 'MtDatePickerInput')
  .prop('label', 'Birth Date')
  .validation('min').args({value: '1980-01-07T00:00:00.000Z'})

  .component('submit', 'MtButton')
  .prop('children', 'Submit')
  .event('onClick')
  .commonAction('validate').args({failOnError: true})
  .customAction('onSubmit')
  .json()

export const App = () => {
  return <FormViewer
    view={view}
    getForm={() => simpleForm}
    actions={{
      onSubmit: (e) => {
        // submit the form to the backend
        alert('Form data: ' + JSON.stringify(e.data))
      },
    }}
  />
}
```

## Resources

- [Website](https://formengine.io/)
- [Documentation](https://formengine.io/documentation)
- [Demo](https://demo.formengine.io/)

## Licensing

This library is distributed under the MIT license.
