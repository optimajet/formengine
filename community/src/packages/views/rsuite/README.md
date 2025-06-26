# OptimaJet React Form Builder RSuite components library

This library is part of the [React Form Builder](https://formengine.io/) project.

This package contains visual components based on [React Suite](https://rsuitejs.com/). To learn how to use the package, see
our [documentation](https://formengine.io/documentation/).

## Key Features

- **UI-Agnostic Components:** Works seamlessly with any UI
  library ([MUI](https://mui.com/), [Ant Design](https://ant.design/), [shadcn/ui](https://ui.shadcn.com/)
  and [others](https://formengine.io/documentation/custom-components))
- **Pre-Built React Suite Integration:** Includes a ready-to-use component
  library – [@react-form-builder/components-rsuite](https://www.npmjs.com/package/@react-form-builder/components-rsuite).
- Framework Support:
  - **Next.js Integration**: Seamlessly works with [Next.js](https://formengine.io/documentation/usage-with-nextjs).
  - **Remix Compatibility**: Fully supports [Remix](https://formengine.io/documentation/usage-with-remix).
  - **Framework-Agnostic**: Can also be used [without any framework](https://formengine.io/documentation/installation#cdn) via CDN.
- **Multi-Database Support:** Compatible with MySQL, PostgreSQL, MongoDB, SQLite, and more.
- **Built-in Validation with Zod:** Includes pre-configured validation rules powered by [Zod](https://github.com/colinhacks/zod).
- **Extensible Validation Support:** Works
  with [Yup](https://github.com/jquense/yup), [AJV](https://github.com/ajv-validator/ajv), [Zod](https://github.com/colinhacks/zod),
  [Superstruct](https://github.com/ianstormtaylor/superstruct),
  [Joi](https://github.com/hapijs/joi), and other custom validation libraries.
- **Responsive Layouts**: Build forms that automatically [adapt](https://formengine.io/documentation/adaptive-layout) to all screen sizes.
- **Custom Actions**: Enhance forms with interactive logic through [custom JavaScript code](https://formengine.io/documentation/actions).
- **Dynamic Properties**: Implement real-time component changes with [MobX](https://github.com/mobxjs/mobx)-powered reactive properties.
- **Flexible Storage Options**:
  - Store complete form definitions as JSON.
  - Programmatically generate forms [via code](https://formengine.io/documentation/building-forms-via-code).

## Install

```bash
npm install @react-form-builder/core @react-form-builder/components-rsuite
```

## Quickstart

```typescript jsx
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
```

## Resources

- [Website](https://formengine.io/)
- [Documentation](https://formengine.io/documentation)
- [Demo](https://demo.formengine.io/)

## Licensing

This library is distributed under the MIT license.

Important: Some features and modules (e.g., Form Designer) are only available under a commercial license.

If you are interested in using the full version of the product, please [contact us](mailto:sales@optimajet.com) or visit
the [product website](https://formengine.io/pricing) for licensing information.
