# OptimaJet React Form Builder JSON schema generator

This library is part of the [React Form Builder](https://formengine.io/) project.

This package contains functions for creating a JSON schema for a form using a list of used components.

Example of use:

```typescript jsx
import {builderViewWithCss, components, rSuiteComponentsDescriptions} from '@react-form-builder/components-rsuite'
import type {GenerateJsonFormSchemaOptions} from '@react-form-builder/designer'
import {FormBuilder} from '@react-form-builder/designer'
import {createSchema} from '@react-form-builder/json-schema-generator'

// Example of use without Designer
function generateMySchema() {
  // or use your components
  const myComponents = components
  // or use your component descriptions
  const myDescriptions = rSuiteComponentsDescriptions
  const schema = createSchema(myComponents, [myDescriptions])
  return JSON.stringify(schema, undefined, 2)
}

const generateJsonFormSchema = (options: GenerateJsonFormSchemaOptions) => {
  const {components, descriptions} = options
  const schema = createSchema(components, descriptions)
  return JSON.stringify(schema, undefined, 2)
}

// Example of use in Designer
const App = () => {
  return <FormBuilder
    view = {builderViewWithCss}
    generateJsonFormSchema = {generateJsonFormSchema}
  />
}
```

## License

MIT
