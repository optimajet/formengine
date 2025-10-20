[![Formengine](https://formengine.io/repository-images/Formengine_bigpicture_2.png)](https://formengine.io/documentation/?utm_source=github&utm_medium=banner-top&utm_campaign=readme#quick-start)
<!-- ==================== FORMENGINE CORE BADGES ==================== -->
[![Total Downloads](https://img.shields.io/npm/dt/@react-form-builder/core?style=for-the-badge&logo=npm&color=4286F4)](https://www.npmjs.com/package/@react-form-builder/core)
[![License MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com/optimajet/formengine/blob/master/LICENSE)
[![Open Issues](https://img.shields.io/github/issues/optimajet/formengine?style=for-the-badge&logo=github&logoColor=white&color=orange)](https://github.com/optimajet/formengine/issues)
[![Closed Issues](https://img.shields.io/github/issues-closed/optimajet/formengine?style=for-the-badge&logo=github&logoColor=white&color=green)](https://github.com/optimajet/formengine/issues?q=is%3Aissue+is%3Aclosed)
<!-- ================================================================ -->

### Struggled with React Hook Form, Formik, or TanStack Form? You’re not alone. It’s time to use something better. Forms shouldn’t be this hard!

#### That’s why we built Formengine Core — a JSON-first React Form Renderer and open-source form engine for React. Describe your form in JSON and render it across your apps. No hooks. No context. No boilerplate. No pain.

### Simple Form Example

[![Formengine](https://formengine.io/repository-images/simpleform.png)](https://formengine.io/documentation/?utm_source=github&utm_medium=article_banner-for&utm_campaign=readme#quick-start)

### Simple Form JSON Example

```json  
{
  "version": "1",
  "errorType": "RsErrorMessage",
  "form": {
    "key": "Screen",
    "type": "Screen",
    "props": {},
    "children": [
      {
        "key": "name",
        "type": "RsInput",
        "props": {
          "label": {
            "value": "Name"
          }
        }
      },
      {
        "key": "email",
        "type": "RsInput",
        "props": {
          "label": {
            "value": "Email"
          }
        },
        "schema": {
          "validations": [
            {
              "key": "email"
            }
          ]
        }
      },
      {
        "key": "submit",
        "type": "RsButton",
        "props": {
          "appearance": {
            "value": "primary"
          },
          "children": {
            "value": "Submit"
          }
        },
        "events": {
          "onClick": [
            {
              "name": "validate",
              "type": "common",
              "args": {
                "failOnError": true
              }
            },
            {
              "name": "onSubmit",
              "type": "custom"
            }
          ]
        }
      }
    ]
  },
  "localization": {},
  "languages": [
    {
      "code": "en",
      "dialect": "US",
      "name": "English",
      "description": "American English",
      "bidi": "ltr"
    }
  ],
  "defaultLanguage": "en-US"
}
```  

<details> 
<summary> Click to see how you can define your entire form in JSON and render it with Formengine Core. </summary>

### Here’s a simple form example you can use in your React app

```tsx
import {viewWithCss} from '@react-form-builder/components-rsuite'
import {FormViewer} from '@react-form-builder/core'

const simpleForm = {
  version: '1',
  errorType: 'RsErrorMessage',
  form: {
    key: 'Screen',
    type: 'Screen',
    props: {},
    children: [
      {
        key: 'name',
        type: 'RsInput',
        props: {
          label: {
            value: 'Name'
          }
        }
      },
      {
        key: 'email',
        type: 'RsInput',
        props: {
          label: {
            value: 'Email'
          }
        },
        schema: {
          validations: [
            {
              key: 'email'
            }
          ]
        }
      },
      {
        key: 'submit',
        type: 'RsButton',
        props: {
          appearance: {
            value: 'primary'
          },
          children: {
            value: 'Submit'
          }
        },
        events: {
          onClick: [
            {
              name: 'validate',
              type: 'common',
              args: {
                failOnError: true
              }
            },
            {
              name: 'onSubmit',
              type: 'custom'
            }
          ],
        }
      }
    ]
  },
  localization: {},
  languages: [
    {
      code: 'en',
      dialect: 'US',
      name: 'English',
      description: 'American English',
      bidi: 'ltr'
    }
  ],
  defaultLanguage: 'en-US'
}

export const App = () => (
  <FormViewer
    view={viewWithCss}
    getForm={() => JSON.stringify(simpleForm)}
    actions={{
      onSubmit: (e) => {
        alert('Form data: ' + JSON.stringify(e.data))
      },
    }}
  />
)
```

</details> 

### 📦 Formengine Core Installation

**It’s time to use something better. Install the core package and RSuite free form components:**

 ```bash  
 npm install @react-form-builder/core @react-form-builder/components-rsuite  
 ```  

## 💙 Why developers love Formengine Core?

- **Open Source & Free Forever** – No vendor lock-in, no nonsense.
- **Less Code, Fewer Bugs** – Logic and UI stay separate.
- **JSON-First Architecture** – Define, render, and validate without touching React internals.
- **UI-Agnostic Components** — Works seamlessly with any UI library (MUI, Ant Design, shadcn/ui, and others).
- **Framework-Agnostic** — Can also be used without any framework via CDN.
- **Multi-Database Support** — Compatible with MySQL, PostgreSQL, MongoDB, SQLite, and more.
- **Built-in Validation with Zod** — Pre-configured validation powered by Zod.
- **Extensible Validation Support** — Works with Yup, AJV, Zod, Superstruct, Joi, and other libraries.
- **Responsive Layouts** — Build forms that automatically adapt to all screen sizes.
- **Custom Actions** — Enhance forms with interactive logic through custom JavaScript.
- **Dynamic Properties** — Enable real-time component updates with MobX-powered reactivity.
- **Pre-Built RSuite Integration** — Includes a ready-to-use component library: `@react-form-builder/components-rsuite`.
- **Flexible Storage Options**
  - Store complete form definitions as JSON.
  - Programmatically generate forms via code.

## 📘 Documentation

- [Full Documentation](https://formengine.io/documentation/?utm_source=github&utm_medium=article&utm_campaign=readme#quick-start)
- [FAQ](https://formengine.io/documentation/category/faq?utm_source=github&utm_medium=article&utm_campaign=readme)
- [Guides](https://formengine.io/documentation/category/guides?utm_source=github&utm_medium=article&utm_campaign=readme)

## 🗄️ Repository structure

- **Community:** Formengine Core source code and examples for FormEngine Community (MIT license).
- **Premium:** Examples for Premium On-Premise Drag-and-Drop React Form Builder (Commercial license). Premium On-Premise Drag-and-Drop React
  Form Builder
- [Source Code](https://github.com/optimajet/formengine/tree/master/community/src)

## 🧩 Compatibility

- **Works out of the box with** - [Next.js](https://formengine.io/documentation/usage-with-nextjs?utm_source=github&utm_medium=article&utm_campaign=readme).
- **Fully supports** - [Remix](https://formengine.io/documentation/usage-with-remix?utm_source=github&utm_medium=article&utm_campaign=readme).

## ✅ Validation

- **Built-in Validation with Zod** — [Pre-configured validation powered by Zod](https://formengine.io/documentation/validation?utm_source=github&utm_medium=article&utm_campaign=readme)
- **Extensible Validation Support** — [Works with Yup, AJV, Zod, Superstruct, Joi, and other libraries](https://formengine.io/documentation/validation?utm_source=github&utm_medium=article&utm_campaign=readme#External)

## Ready to use Pre-Built RSuite Form UI Components

 ```bash  
 npm install @react-form-builder/components-rsuite  
 ```  

[![Formengine Drag and n Drop](https://formengine.io/repository-images/components-ui.png)](https://formengine.io/react-form-components-library?utm_source=github&utm_medium=article_banne-dndr&utm_campaign=readme)

## 🟦🟥🟨🟩 Custom components

Component description consists of defining meta-information about the component - component name, component type, component properties.
Meta-information on component properties in Formengine is called an annotation.

Well, let's describe some existing component from the popular MUI library. As an example, let's take a Button:

#### Example of a custom component definition

 ```tsx 
import {Button} from '@mui/material'
import {define, disabled, event, oneOf, string} from '@react-form-builder/core'

// Let's call our component matButton, using the prefix 'mat' to make it easy to understand
// from the name that the component belongs to the MUI library.
//
// Here we call the define function and pass it two parameters - the Button component
// and the unique name of the component type.
export const matButton = define(Button, 'MatButton')
  // component name displayed in the component panel in the designer
  .name('Button')
  // define the component properties that we want to edit in the designer
  .props({
    // button text
    children: string.named('Caption').default('Button'),
    // button color
    color: oneOf('inherit', 'primary', 'secondary', 'success', 'error', 'info', 'warning'),
    // button disable flag
    disabled: disabled,
    // callback fired when the button is clicked.
    onClick: event,
  })
 ```

## 🌍 Free Online Drag & Drop Form Builder

[![Try it now](https://img.shields.io/badge/FORM_BUILDER-%20✅%20ONLINE%20-brightgreen?style=for-the-badge)](https://formbuilder.formengine.io/?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![ChatGPT](https://img.shields.io/badge/ChatGPT-COMPLEX_FORM_BUILDER-F58319?style=for-the-badge&logo=openai&logoColor=white)](https://formengine.io/ai-form-builder?utm_source=github&utm_medium=article-badge&utm_campaign=readme)

## 🤝 Support & Community

- [Community Forum](https://github.com/optimajet/formengine/discussions?utm_source=github&utm_medium=article&utm_campaign=readme) – Best
  for: help with building, discussion about React form best practices.
- [GitHub Issues](https://github.com/optimajet/formengine/issues?utm_source=github&utm_medium=article&utm_campaign=readme) – Best for: bugs
  and errors you encounter using Formengine.
- [Email Support](mailto:support@optimajet.com) – Best for: issues with Formengine
  libraries or environment.

## A premium on-premise React Form Builder with drag-and-drop, built for SaaS and enterprise teams — backed by Optimajet Premium Support

#### React Form Builder - That Developers Can Customize and Teams Can Use

A powerful commercial drag-and-drop form builder for React, built on top of the free, MIT-licensed FormEngine Core. Advanced form logic, UI
controls, export, and integrations.

```bash  
 npm install @react-form-builder/designer
 ```

[![Contributions welcome](https://img.shields.io/badge/Contribute-💡_Ideas-FF69B4?style=for-the-badge&logo=github)](https://github.com/optimajet/formengine/issues?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![Try Demo](https://img.shields.io/badge/🚀_Try_Live_Demo-4286F4?style=for-the-badge)](https://demo.formengine.io/?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![Meet with US](https://img.shields.io/badge/Book_a_Meeting-WITH_OPTIMAJET-4286F4?style=for-the-badge&logo=calendar&logoColor=white)](https://optimajet.com/book-a-meeting/?utm_source=github&utm_medium=article-badge&utm_campaign=readme)

[![Formengine Drag and n Drop](https://formengine.io/repository-images/DND-react-form-builder.png)](https://formbuilder.formengine.io?utm_source=github&utm_medium=banner&utm_campaign=readme)

### 📦 Formengine Core Installation

**It’s time to use something better. Install the core package and RSuite free form components:**

 ```bash  
 npm install @react-form-builder/core @react-form-builder/components-rsuite  
 ``` 

## 🫶 We hope this project has saved you hours — ⭐ star this repo to support development. Your support keeps Formengine Core open and free

#### Formengine Core — You’re not alone. Forms shouldn’t be this hard!

[![Documentation](https://img.shields.io/badge/Documentation-Install-4286F4?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://formengine.io/documentation/#quick-start?utm_source=github&utm_medium=article-badge&utm_campaign=readme#quick-start)
[![LLMs.txt](https://img.shields.io/badge/_LLMs.txt-FF69B4?style=for-the-badge)](https://formengine.io/llms?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://hk.linkedin.com/company/optimajet?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@optimajet?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white)](https://dev.to/optimajet?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![Join Community](https://img.shields.io/badge/💬_Join-Community-4286F4?style=for-the-badge&logo=github)](https://github.com/optimajet/formengine/discussions?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
