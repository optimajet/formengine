# OptimaJet React Form Builder Material UI components library

This library is part of the [React Form Builder](https://formengine.io/) project.

This package contains visual components based on [Material UI](https://www.npmjs.com/package/@mui/material).
To learn how to use the package, see our [documentation](https://formengine.io/documentation/).

## React 18 and below

If you are using React 18 or below, you need to set up a resolution of `react-is` package to the same version as the react you are using.
[Follow this guide](https://mui.com/material-ui/getting-started/installation/#react-18-and-below).

## Connect to FormViewer

### Install

```bash
npm install @react-form-builder/core @mui/material @emotion/react @emotion/styled @react-form-builder/components-material-ui
```

### Quickstart

```typescript jsx
import {buildForm, FormViewer} from '@react-form-builder/core'
import {view} from '@react-form-builder/components-material-ui'

const simpleForm = buildForm({errorType: 'MuiErrorWrapper'})
  .component('firstName', 'MuiTextField')
  .prop('placeholder', 'Enter your first name')
  .prop('label', 'First Name')
  .validation('required')

  .component('lastName', 'MuiTextField')
  .prop('placeholder', 'Enter your last name')
  .prop('label', 'Last Name')
  .validation('required')

  .component('submit', 'MuiButton')
  .prop('children', 'Submit')
  .prop('color', 'primary')
  .prop('variant', 'contained')
  .event('onClick')
  .commonAction('validate').args({failOnError: true})
  .customAction('onSubmit')
  .json()

export const ViewerApp = () => {
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

## Connect to FormBuilder

### Install

```bash
npm install @react-form-builder/core @react-form-builder/designer @mui/material @emotion/react @emotion/styled @react-form-builder/components-material-ui
```

### Quickstart

```typescript jsx
import {buildForm} from '@react-form-builder/core'
import {FormBuilder} from '@react-form-builder/designer'
import {builderView} from '@react-form-builder/components-material-ui'

const simpleForm = buildForm({errorType: 'MuiErrorWrapper'})
  .component('firstName', 'MuiTextField')
  .prop('placeholder', 'Enter your first name')
  .prop('label', 'First Name')
  .validation('required')

  .component('lastName', 'MuiTextField')
  .prop('placeholder', 'Enter your last name')
  .prop('label', 'Last Name')
  .validation('required')

  .component('submit', 'MuiButton')
  .prop('children', 'Submit')
  .prop('color', 'primary')
  .prop('variant', 'contained')
  .event('onClick')
  .commonAction('validate').args({failOnError: true})
  .customAction('onSubmit')
  .json()

export const BuilderApp = () => {
  return <FormBuilder
    view={builderView}
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

## License

This library is distributed under the MIT license.
