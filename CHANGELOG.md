# Changelog

All notable changes to FormEngine are documented here. For full, detailed release notes with screenshots and links, see the documentation:

- Latest release notes: https://formengine.io/documentation/release-notes

## 10.0.1 - July 6, 2026

Fixes npm publication packages and bumps example dependencies.

[Full release notes for 10.0.1](https://formengine.io/documentation/release-notes/10.0.1)

## 10.0.0 - July 3, 2026

Removes deprecated APIs, updates German localization, refactors LocalizationStore, fixes Monaco constrained editing and RSuite CSS minification, and upgrades Zod.

### Highlights

- Removed deprecated APIs for component metadata ([Definer](https://formengine.io/documentation/api-reference/@react-form-builder/core/interfaces/Definer), [Meta](https://formengine.io/documentation/api-reference/@react-form-builder/core/classes/Meta)), number validation, and RSuite date/time pickers.
- Retranslated German (`de-DE`) locale files via `localization.config.json`.
- Reworked [LocalizationStore](https://formengine.io/documentation/api-reference/@react-form-builder/core/classes/LocalizationStore) and expanded [ILocalizationStore](https://formengine.io/documentation/api-reference/@react-form-builder/core/interfaces/ILocalizationStore).
- In-house constrained Monaco editing for [computed properties](https://formengine.io/documentation/formengine-designer/features/computed-properties) and localization code fields.
- Fixed `@font-face` placement in RSuite CSS; Lightning CSS minification enabled in production builds.

[Full release notes for 10.0.0](https://formengine.io/documentation/release-notes/10.0.0)

## 9.0.0 - May 20, 2026

Localizable arrays, separate Builder UI and form-preview language props, German locale updates, and dependency bumps.

### Highlights

- [Localizable array properties](https://formengine.io/documentation/formengine-core/localization#localizing-array-data) via [ArrayBuilder.localize](https://formengine.io/documentation/api-reference/@react-form-builder/core/classes/ArrayBuilder#localize) for component metadata authors.
- [Fluent interpolation in localized arrays and objects](https://formengine.io/documentation/formengine-core/localization#variables-in-localized-arrays-and-objects) at runtime.
- Separate Builder UI and form-preview language defaults on [FormBuilder](https://formengine.io/documentation/api-reference/@react-form-builder/designer/interfaces/FormBuilderProps): [defaultBuilderLanguage](https://formengine.io/documentation/api-reference/@react-form-builder/designer/interfaces/FormBuilderProps#defaultbuilderlanguage), [defaultViewerLanguage](https://formengine.io/documentation/api-reference/@react-form-builder/designer/interfaces/FormBuilderProps#defaultviewerlanguage).

[Full release notes for 9.0.0](https://formengine.io/documentation/release-notes/9.0.0)

## 8.1.0 - May 1, 2026

Localization fallbacks without the `[NOT LOCALIZED]` placeholder, Fluent bundle improvements, Designer language-switch customization,

### Highlights

- [Language switch customization](https://formengine.io/documentation/formengine-designer/features/designer-customization#language-switch-customization) for `MainMenu_Item_LanguageSwitch` and `MainMenu_Item_LanguageItem_<language-full-code>` in the Designer.

[Full release notes for 8.1.0](https://formengine.io/documentation/release-notes/8.1.0)

## 8.0.0 - April 21, 2026

CSP-friendly Core styling, optional localization, designer menu customization, Monaco update, and displayName breaking change

### Highlights

- Core styles ship as static CSS for stricter CSP: import `@react-form-builder/core/assets/styles.css` per [Install FormEngine Core](https://formengine.io/documentation/formengine-core/installation).
- [FormViewerLite](https://formengine.io/documentation/api-reference/@react-form-builder/core/variables/FormViewerLite) uses [NoopLocalizationEngine](https://formengine.io/documentation/api-reference/@react-form-builder/core/classes/NoopLocalizationEngine) by default; [FormViewer](https://formengine.io/documentation/api-reference/@react-form-builder/core/variables/FormViewer) takes [localizationEngine](https://formengine.io/documentation/api-reference/@react-form-builder/core/interfaces/FormViewerProps#localizationengine) on [FormViewerProps](https://formengine.io/documentation/api-reference/@react-form-builder/core/interfaces/FormViewerProps), so you can use [NoopLocalizationEngine](https://formengine.io/documentation/api-reference/@react-form-builder/core/classes/NoopLocalizationEngine) or a custom [ILocalizationEngine](https://formengine.io/documentation/api-reference/@react-form-builder/core/interfaces/ILocalizationEngine).
- [Menu items customization](https://formengine.io/documentation/formengine-designer/features/designer-customization#menu-items-customization) for Designer main-menu controls (`MainMenu_Item_*` keys).
- Monaco editor updated to **0.55.1**.

[Full release notes for 8.0.0](https://formengine.io/documentation/release-notes/8.0.0)

## 7.15.0 - April 1, 2026

FormBuilder language callbacks, preset name in onFormElementAdd

### Highlights

- Added [onBuilderLanguageChange](https://formengine.io/documentation/api-reference/@react-form-builder/designer/interfaces/FormBuilderProps#onbuilderlanguagechange) and [onViewerLanguageChange](https://formengine.io/documentation/api-reference/@react-form-builder/designer/interfaces/FormBuilderProps#onviewerlanguagechange) on [FormBuilderProps](https://formengine.io/documentation/api-reference/@react-form-builder/designer/interfaces/FormBuilderProps).
- Added optional [presetName](https://formengine.io/documentation/api-reference/@react-form-builder/designer/interfaces/FormBuilderProps#onformelementadd) to the [onFormElementAdd](https://formengine.io/documentation/api-reference/@react-form-builder/designer/interfaces/FormBuilderProps#onformelementadd) payload (see [Tracking component add and remove events](https://formengine.io/documentation/formengine-designer/faq/tracking-component-add-and-remove-events)).
- Updated the [public FormEngine example](https://github.com/optimajet/formengine) to use form storage (IndexedDB) alongside the designer.

[Full release notes for 7.15.0](https://formengine.io/documentation/release-notes/7.15.0)

## 7.14.0 - March 19, 2026

IndexedDB form storage, Angular integration examples and bug fixes

### Highlights

- Published `@react-form-builder/indexed-db-form-storage` for browser-based form persistence.
- Updated [Form storage documentation](https://formengine.io/documentation/formengine-designer/features/form-storage#example-of-iformstorage-working-with-indexeddb) with the IndexedDB example.

[Full release notes for 7.14.0](https://formengine.io/documentation/release-notes/7.14.0)

## 7.13.0 - March 10, 2026

Component ref, Designer improvements, MUI DatePicker

### Highlights

- Added [MuiDatePicker](https://formengine.io/documentation/components-library/material-ui/date-picker) support.
- Added [component toolbar customization](https://formengine.io/documentation/formengine-designer/features/designer-customization#customizing-the-formbuilder-interface) in the designer.
- Added designer events for [add/remove callbacks](https://formengine.io/documentation/formengine-designer/faq/tracking-component-add-and-remove-events).
- Added direct component ref handling in action events via [refValue](https://formengine.io/documentation/formengine-core/actions-and-events#accessing-the-component-dom-element-in-actions) (DOM element, imperative handle, or `null`).

[Full release notes for 7.13.0](https://formengine.io/documentation/release-notes/7.13.0)

## 7.12.0 - February 17, 2026

Mantine components integration, JSON schemas for components, and maintenance updates

### Highlights

- Mantine components integration for building forms with the Mantine UI library.
- JSON schemas for component libraries.
- Extended configuration options, including support for passing user-defined context.

[Full release notes for 7.12.0](https://formengine.io/documentation/release-notes/7.12.0)

## 7.11.0 - February 3, 2026

Core package cleanup, MUI improvements, dependency updates, and documentation

### Highlights

- Leaner core package after barrel file removal (improved tree shaking).
- MUI disabled and read-only support and new component options (MuiDialog, MuiTextField type).
- Dependency and security updates across examples and core.

[Full release notes for 7.11.0](https://formengine.io/documentation/release-notes/7.11.0)

## 7.10.0 - January 16, 2026

Material UI library integration, documentation, and security updates

### Highlights

- Integration with the **Material UI** components library for building and rendering forms.
- Improved theming capabilities in FormViewer, including support for theme switching.

[Full release notes for 7.10.0](https://formengine.io/documentation/release-notes/7.10.0)

## 7.9.0

FormEngine 7.9.0 release notes

[Full release notes for 7.9.0](https://formengine.io/documentation/release-notes/7.9.0)

## 7.8.0

FormEngine 7.8.0 release notes

[Full release notes for 7.8.0](https://formengine.io/documentation/release-notes/7.8.0)

## 7.7.0

FormEngine 7.7.0 release notes

[Full release notes for 7.7.0](https://formengine.io/documentation/release-notes/7.7.0)

## 7.6.0

FormEngine 7.6.0 release notes

[Full release notes for 7.6.0](https://formengine.io/documentation/release-notes/7.6.0)

## 7.5.0

FormEngine 7.5.0 release notes

[Full release notes for 7.5.0](https://formengine.io/documentation/release-notes/7.5.0)

## 7.4.0

FormEngine 7.4.0 release notes

[Full release notes for 7.4.0](https://formengine.io/documentation/release-notes/7.4.0)

## 7.3.0

FormEngine 7.3.0 release notes

[Full release notes for 7.3.0](https://formengine.io/documentation/release-notes/7.3.0)

## 7.2.0

FormEngine 7.2.0 release notes

[Full release notes for 7.2.0](https://formengine.io/documentation/release-notes/7.2.0)

## 7.1.0

FormEngine 7.1.0 release notes

[Full release notes for 7.1.0](https://formengine.io/documentation/release-notes/7.1.0)

## 7.0.0

FormEngine 7.0.0 release notes

[Full release notes for 7.0.0](https://formengine.io/documentation/release-notes/7.0.0)

## 6.2.1

FormEngine 6.2.1 release notes

[Full release notes for 6.2.1](https://formengine.io/documentation/release-notes/6.2.1)

## 6.2.0

FormEngine 6.2.0 release notes

[Full release notes for 6.2.0](https://formengine.io/documentation/release-notes/6.2.0)

## 6.1.0

FormEngine 6.1.0 release notes

[Full release notes for 6.1.0](https://formengine.io/documentation/release-notes/6.1.0)

## 6.0.0

FormEngine 6.0.0 release notes

[Full release notes for 6.0.0](https://formengine.io/documentation/release-notes/6.0.0)

## 5.2.0

FormEngine 5.2.0 release notes

[Full release notes for 5.2.0](https://formengine.io/documentation/release-notes/5.2.0)

## 5.1.0

FormEngine 5.1.0 release notes

[Full release notes for 5.1.0](https://formengine.io/documentation/release-notes/5.1.0)

## 5.0.1

FormEngine 5.0.1 release notes

[Full release notes for 5.0.1](https://formengine.io/documentation/release-notes/5.0.1)

## 5.0.0

FormEngine 5.0.0 release notes

[Full release notes for 5.0.0](https://formengine.io/documentation/release-notes/5.0.0)

## 4.3.2

FormEngine 4.3.2 release notes

[Full release notes for 4.3.2](https://formengine.io/documentation/release-notes/4.3.2)

## 4.3.1

FormEngine 4.3.1 release notes

[Full release notes for 4.3.1](https://formengine.io/documentation/release-notes/4.3.1)

## 4.3.0

FormEngine 4.3.0 release notes

[Full release notes for 4.3.0](https://formengine.io/documentation/release-notes/4.3.0)

## 4.2.0

FormEngine 4.2.0 release notes

[Full release notes for 4.2.0](https://formengine.io/documentation/release-notes/4.2.0)

## 4.1.0

FormEngine 4.1.0 release notes

[Full release notes for 4.1.0](https://formengine.io/documentation/release-notes/4.1.0)

## 4.0.0

FormEngine 4.0.0 release notes

[Full release notes for 4.0.0](https://formengine.io/documentation/release-notes/4.0.0)

## 3.6.0

FormEngine 3.6.0 release notes

[Full release notes for 3.6.0](https://formengine.io/documentation/release-notes/3.6.0)

## 3.5.0

FormEngine 3.5.0 release notes

[Full release notes for 3.5.0](https://formengine.io/documentation/release-notes/3.5.0)

## 3.4.1

FormEngine 3.4.1 release notes

[Full release notes for 3.4.1](https://formengine.io/documentation/release-notes/3.4.1)

## 3.4.0

FormEngine 3.4.0 release notes

[Full release notes for 3.4.0](https://formengine.io/documentation/release-notes/3.4.0)

## 3.3.0

FormEngine 3.3.0 release notes

[Full release notes for 3.3.0](https://formengine.io/documentation/release-notes/3.3.0)

## 3.2.0

FormEngine 3.2.0 release notes

[Full release notes for 3.2.0](https://formengine.io/documentation/release-notes/3.2.0)

## 3.1.0

FormEngine 3.1.0 release notes

[Full release notes for 3.1.0](https://formengine.io/documentation/release-notes/3.1.0)

## 3.0.2

FormEngine 3.0.2 release notes

[Full release notes for 3.0.2](https://formengine.io/documentation/release-notes/3.0.2)

## 3.0.1

FormEngine 3.0.1 release notes

[Full release notes for 3.0.1](https://formengine.io/documentation/release-notes/3.0.1)

## 3.0.0

FormEngine 3.0.0 release notes

[Full release notes for 3.0.0](https://formengine.io/documentation/release-notes/3.0.0)

## 2.4.0

FormEngine 2.4.0 release notes

[Full release notes for 2.4.0](https://formengine.io/documentation/release-notes/2.4.0)

## 2.3.0

FormEngine 2.3.0 release notes

[Full release notes for 2.3.0](https://formengine.io/documentation/release-notes/2.3.0)

## 2.2.0

FormEngine 2.2.0 release notes

[Full release notes for 2.2.0](https://formengine.io/documentation/release-notes/2.2.0)

## 2.1.0

FormEngine 2.1.0 release notes

[Full release notes for 2.1.0](https://formengine.io/documentation/release-notes/2.1.0)

## 2.0.0

FormEngine 2.0.0 release notes

[Full release notes for 2.0.0](https://formengine.io/documentation/release-notes/2.0.0)

## 1.14.1

FormEngine 1.14.1 release notes

[Full release notes for 1.14.1](https://formengine.io/documentation/release-notes/1.14.1)

## 1.14.0

FormEngine 1.14.0 release notes

[Full release notes for 1.14.0](https://formengine.io/documentation/release-notes/1.14.0)

## 1.13.0

FormEngine 1.13.0 release notes

[Full release notes for 1.13.0](https://formengine.io/documentation/release-notes/1.13.0)

## 1.12.0

FormEngine 1.12.0 release notes

[Full release notes for 1.12.0](https://formengine.io/documentation/release-notes/1.12.0)

## 1.11.0

FormEngine 1.11.0 release notes

[Full release notes for 1.11.0](https://formengine.io/documentation/release-notes/1.11.0)

## 1.10.0

FormEngine 1.10.0 release notes

[Full release notes for 1.10.0](https://formengine.io/documentation/release-notes/1.10.0)

## 1.9.0

FormEngine 1.9.0 release notes

[Full release notes for 1.9.0](https://formengine.io/documentation/release-notes/1.9.0)

## 1.8.0

FormEngine 1.8.0 release notes

[Full release notes for 1.8.0](https://formengine.io/documentation/release-notes/1.8.0)

## 1.7.0

FormEngine 1.7.0 release notes

[Full release notes for 1.7.0](https://formengine.io/documentation/release-notes/1.7.0)

## 1.6.0

FormEngine 1.6.0 release notes

[Full release notes for 1.6.0](https://formengine.io/documentation/release-notes/1.6.0)

## 1.5.2

FormEngine 1.5.2 release notes

[Full release notes for 1.5.2](https://formengine.io/documentation/release-notes/1.5.2)

## 1.5.1

FormEngine 1.5.1 release notes

[Full release notes for 1.5.1](https://formengine.io/documentation/release-notes/1.5.1)

## 1.5.0

FormEngine 1.5.0 release notes

[Full release notes for 1.5.0](https://formengine.io/documentation/release-notes/1.5.0)

## 1.4.0

FormEngine 1.4.0 release notes

[Full release notes for 1.4.0](https://formengine.io/documentation/release-notes/1.4.0)

## 1.3.1

FormEngine 1.3.1 release notes

[Full release notes for 1.3.1](https://formengine.io/documentation/release-notes/1.3.1)

## 1.3.0

FormEngine 1.3.0 release notes

[Full release notes for 1.3.0](https://formengine.io/documentation/release-notes/1.3.0)

## 1.2.0

FormEngine 1.2.0 release notes

[Full release notes for 1.2.0](https://formengine.io/documentation/release-notes/1.2.0)

## 1.1.0

FormEngine 1.1.0 release notes

[Full release notes for 1.1.0](https://formengine.io/documentation/release-notes/1.1.0)

## 1.0.9

FormEngine 1.0.9 release notes

[Full release notes for 1.0.9](https://formengine.io/documentation/release-notes/1.0.9)

## 1.0.8

FormEngine 1.0.8 release notes

[Full release notes for 1.0.8](https://formengine.io/documentation/release-notes/1.0.8)

## 1.0.7

FormEngine 1.0.7 release notes

[Full release notes for 1.0.7](https://formengine.io/documentation/release-notes/1.0.7)

## 1.0.6

FormEngine 1.0.6 release notes

[Full release notes for 1.0.6](https://formengine.io/documentation/release-notes/1.0.6)

## 1.0.5

FormEngine 1.0.5 release notes

[Full release notes for 1.0.5](https://formengine.io/documentation/release-notes/1.0.5)

## 1.0.4

FormEngine 1.0.4 release notes

[Full release notes for 1.0.4](https://formengine.io/documentation/release-notes/1.0.4)

## 1.0.3

FormEngine 1.0.3 release notes

[Full release notes for 1.0.3](https://formengine.io/documentation/release-notes/1.0.3)

## 1.0.2

FormEngine 1.0.2 release notes

[Full release notes for 1.0.2](https://formengine.io/documentation/release-notes/1.0.2)

## 1.0.1

FormEngine 1.0.1 release notes

[Full release notes for 1.0.1](https://formengine.io/documentation/release-notes/1.0.1)

## 1.0.0

FormEngine 1.0.0 release notes

[Full release notes for 1.0.0](https://formengine.io/documentation/release-notes/1.0.0)

## 0.0.14

FormEngine 0.0.14 release notes

[Full release notes for 0.0.14](https://formengine.io/documentation/release-notes/0.0.14)

## 0.0.13

FormEngine 0.0.13 release notes

[Full release notes for 0.0.13](https://formengine.io/documentation/release-notes/0.0.13)
