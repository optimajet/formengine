# Optimajet FormEngine Premium examples

## Overview

**FormEngine Premium**
A commercial drag-and-drop form builder for React that includes everything in **FormEngine Community**,
plus an embeddable visual form editor and a set of business-specific components.
Build front-end forms visually to cut costs and speed up development.

This directory contains examples of how to use **FormEngine Premium** product.

- examples/formengine: simple integration example.
- examples/with-formik: Formik integration example.
- examples/with-nextjs: Next.js integration example.
- examples/with-remix: Remix integration example.

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

## Documentation

[Documentation website](https://formengine.io/documentation)

## FormEngine Premium packages

<table>
  <thead>
  <tr>
    <th>Package</th>
    <th>Badges</th>
    <th>Description</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/designer">@react-form-builder/designer</a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/designer">
        <img alt="npm @react-form-builder/designer" src="https://img.shields.io/npm/v/@react-form-builder/designer"></a>
      <img alt="license @react-form-builder/designer" src="https://img.shields.io/npm/l/@react-form-builder/designer">
    </td>
    <td>
      This package contains a visual editor for React components.
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/designer-bundle">@react-form-builder/designer-bundle</a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/designer-bundle">
        <img alt="npm @react-form-builder/designer-bundle" src="https://img.shields.io/npm/v/@react-form-builder/designer-bundle"></a>
      <img alt="license @react-form-builder/designer-bundle" src="https://img.shields.io/npm/l/@react-form-builder/designer-bundle">
    </td>
    <td>The <code>@react-form-builder/designer</code> and <code>@react-form-builder/components-rsuite</code> packages built for use on an
      HTML page without React.
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/components-rich-text">@react-form-builder/components-rich-text</a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/components-rich-text">
        <img alt="npm @react-form-builder/components-rich-text" src="https://img.shields.io/npm/v/@react-form-builder/components-rich-text"></a>
      <img alt="license @react-form-builder/components-rich-text"
           src="https://img.shields.io/npm/l/@react-form-builder/components-rich-text">
    </td>
    <td>
      This package contains visual components based on <a href="https://www.npmjs.com/package/react-quill-new">React Quill</a>.
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/components-google-map">@react-form-builder/components-google-map</a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/components-google-map">
        <img alt="npm @react-form-builder/components-google-map"
             src="https://img.shields.io/npm/v/@react-form-builder/components-google-map"></a>
      <img alt="license @react-form-builder/components-google-map"
           src="https://img.shields.io/npm/l/@react-form-builder/components-google-map">
    </td>
    <td>
      The package contains visual components for Google Maps integration.
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/components-fast-qr">@react-form-builder/components-fast-qr</a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/components-fast-qr">
        <img alt="npm @react-form-builder/components-fast-qr" src="https://img.shields.io/npm/v/@react-form-builder/components-fast-qr"></a>
      <img alt="license @react-form-builder/components-fast-qr" src="https://img.shields.io/npm/l/@react-form-builder/components-fast-qr">
    </td>
    <td>
      The package contains visual components based on <a href="https://www.npmjs.com/package/fast_qr">Fast QR</a>.
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/components-signature">@react-form-builder/components-signature</a>
    </td>
    <td>
      <a href="https://www.npmjs.com/package/@react-form-builder/components-signature">
        <img alt="npm @react-form-builder/components-signature" src="https://img.shields.io/npm/v/@react-form-builder/components-fast-qr"></a>
      <img alt="license @react-form-builder/components-signature" src="https://img.shields.io/npm/l/@react-form-builder/components-fast-qr">
    </td>
    <td>
      The package contains visual components based on <a href="https://www.npmjs.com/package/signature_pad">SignaturePad</a>.
    </td>
  </tr>
  </tbody>
</table>

## Screenshots

[![Form Engine Premium](./../screenshots/builder.png "Form Engine Premium")](https://demo.formengine.io)


## License

EULA: [https://optimajet.com/products/formengine/eula/](https://optimajet.com/products/formengine/eula/).
For FormEngine Premium inquiries, please contact [sales@optimajet.com](mailto:sales@optimajet.com).
