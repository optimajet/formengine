[![Formengine](https://formengine.io/repository-images/Formengine_FB_Hero.png)](https://formengine.io/documentation/?utm_source=github&utm_medium=banner-top&utm_campaign=readme)
[![Documentation](https://img.shields.io/badge/Documentation-Install-4286F4?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://formengine.io/documentation/installation?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![Total Downloads](https://img.shields.io/npm/dt/@react-form-builder/designer?style=for-the-badge&logo=npm&color=4286F4&logoColor=white)](https://www.npmjs.com/package/@react-form-builder/designer?utm_source=github&utm_medium=banner-top&utm_campaign=readme)
[![License](https://img.shields.io/badge/License-EULA-4286F4?style=for-the-badge&logoColor=white)](https://optimajet.com/products/formengine/eula/?utm_source=github&utm_medium=banner-top&utm_campaign=readme)
[![Closed Issues](https://img.shields.io/github/issues-closed/optimajet/formengine?style=for-the-badge&logo=github&logoColor=white&color=4286F4)](https://github.com/optimajet/formengine/issues?q=is%3Aissue+is%3Aclosed)
[![Release date](https://img.shields.io/github/release-date/optimajet/formengine?style=for-the-badge&logo=github&logoColor=white&color=4286F4)](https://github.com/optimajet/formengine/releases?utm_source=github&utm_medium=banner-top&utm_campaign=readme)

# An Enterprise-Grade React Form Builder with Drag-and-Drop for Complex Forms and No Performance Compromises

## 📘 Documentation

- [Full Documentation](https://formengine.io/documentation/?utm_source=github&utm_medium=article&utm_campaign=readme#quick-start)
- [FAQ](https://formengine.io/documentation/category/faq?utm_source=github&utm_medium=article&utm_campaign=readme)
- [Guides](https://formengine.io/documentation/category/guides?utm_source=github&utm_medium=article&utm_campaign=readme)

### 📦 Formengine Core Installation — MIT Licensed

**Install the core package and RSuite free form components:**

 ```bash
 npm install @react-form-builder/core @react-form-builder/components-rsuite
 ```

### 📦 Formengine Drag-and-Drop Form Builder Installation — Commercial License

**Install drag-and-drop Form Builder, built on top of the free, MIT-licensed FormEngine Core.**

```bash
 npm install @react-form-builder/designer
 ```

[![Formengine Drag and n Drop](https://formengine.io/repository-images/DND-react-form-builder.png)](https://formbuilder.formengine.io?utm_source=github&utm_medium=banner&utm_campaign=readme)

## 🌍 Free Online Drag & Drop Form Builder

[![Try it now](https://img.shields.io/badge/FORM_BUILDER-%20✅%20ONLINE%20-brightgreen?style=for-the-badge)](https://formbuilder.formengine.io/?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![ChatGPT](https://img.shields.io/badge/ChatGPT-COMPLEX_FORM_BUILDER-F58319?style=for-the-badge&logo=openai&logoColor=white)](https://formengine.io/ai-form-builder?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![Try Demo](https://img.shields.io/badge/🚀_Try_Live_Demo-4286F4?style=for-the-badge)](https://demo.formengine.io/?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![Meet with US](https://img.shields.io/badge/Book%20a%20Meeting-WITH_OPTIMAJET-4286F4?style=for-the-badge&logo=calendar&logoColor=white)](https://optimajet.com/book-a-meeting/?utm_source=github&utm_medium=article-badge&utm_campaign=readme)

## 🤝 Powered by Optimajet Premium Support, designed for SaaS and enterprise teams.

- [Email Support](mailto:support@optimajet.com) – Best for: issues with Formengine libraries or environment.
- [Community Forum](https://github.com/optimajet/formengine/discussions?utm_source=github&utm_medium=article&utm_campaign=readme) – Best
  for: help with building, discussion about React form best practices.
- [GitHub Issues](https://github.com/optimajet/formengine/issues?utm_source=github&utm_medium=article&utm_campaign=readme) – Best for: bugs
  and errors you encounter using Formengine.

## 🗄️ Repository structure

- **Community:** Formengine Core source code and examples for FormEngine Community (MIT license).
- **Premium:** Examples for Premium On-Premise Drag-and-Drop React Form Builder (Commercial license). Premium On-Premise Drag-and-Drop React
  Form Builder
- [Formengine Core Source Code](https://github.com/optimajet/formengine/tree/master/community/src)

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

## 🫶 We hope this project has saved you hours — ⭐ star this repo to support development. Your support keeps Formengine Core open and free

#### Formengine — You’re not alone. Forms shouldn’t be this hard!

[![Documentation](https://img.shields.io/badge/Documentation-Install-4286F4?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://formengine.io/documentation/#quick-start?utm_source=github&utm_medium=article-badge&utm_campaign=readme#quick-start)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://hk.linkedin.com/company/optimajet?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@optimajet?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![dev.to](https://img.shields.io/badge/dev.to-0A0A0A?style=for-the-badge&logo=dev.to&logoColor=white)](https://dev.to/optimajet?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![Join Community](https://img.shields.io/badge/💬_Join-Community-4286F4?style=for-the-badge&logo=github)](https://github.com/optimajet/formengine/discussions?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
[![Contributions welcome](https://img.shields.io/badge/Contribute-💡_Ideas-FF69B4?style=for-the-badge&logo=github)](https://github.com/optimajet/formengine/issues?utm_source=github&utm_medium=article-badge&utm_campaign=readme)
