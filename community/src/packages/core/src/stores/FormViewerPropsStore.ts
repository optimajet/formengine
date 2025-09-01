import {makeObservable, observable} from 'mobx'
import type {ComponentType} from 'react'
import {View} from '../features/define'
import type {ActionValues} from '../features/event'
import type {FormViewerProps} from '../features/form-viewer'
import type {ComponentLocalizer} from '../features/form-viewer/ComponentLocalizer'
import {customActionsToActionsValues} from '../features/form-viewer/CustomActions'
import type {FormValidators} from '../features/form-viewer/FormValidators'
import type {LanguageFullCode} from '../features/localization/types'
import type {ErrorWrapperProps} from '../features/validation'
import type {Validators} from '../features/validation/types/CustomValidationRules'
import {nameObservable} from '../utils/observableNaming'

/**
 * Represents the props passed to the FormViewer Store. **Internal use only.**
 */
export class FormViewerPropsStore {
  /**
   * The metadata of the form viewer components.
   */
  view: View = new View()
  /**
   * The initial form data.
   */
  initialData: Record<string, unknown> = {}
  /**
   * The set of metadata of validation rules, grouped by the type of value being validated.
   */
  validators?: Validators
  /**
   * The set of functions that validate the form data.
   */
  formValidators?: FormValidators
  /**
   * The function to localize the properties of a component.
   */
  localizer?: ComponentLocalizer
  /**
   * Custom actions for the form viewer.
   */
  actions?: ActionValues
  /**
   * The full language code passed in the FormViewer properties, e.g. 'en-US'.
   */
  propsLanguage?: LanguageFullCode
  /**
   * The default error wrapper used when errorType is not specified in the form.
   */
  errorWrapper?: ComponentType<ErrorWrapperProps>
  /**
   * If true, the form is read-only.
   */
  readOnly?: boolean
  /**
   * If true, the form is disabled.
   */
  disabled?: boolean
  /**
   * If true, all validation errors will be displayed.
   */
  showAllValidationErrors?: boolean
  /**
   * The arbitrary user context.
   */
  context?: any

  /**
   * Constructs a new FormViewerPropsStore from the given FormViewerProps.
   * @param formViewerProps the FormViewer props.
   * @returns the FormViewerPropsStore.
   */
  constructor(formViewerProps?: FormViewerProps) {
    if (formViewerProps) {
      this.applyProps(formViewerProps)
    }

    makeObservable(this, {
      view: observable.ref,
      initialData: observable.deep,
      validators: observable.ref,
      formValidators: observable.ref,
      localizer: observable.ref,
      actions: observable.ref,
      propsLanguage: observable.ref,
      errorWrapper: observable.ref,
      disabled: observable.ref,
      readOnly: observable.ref,
      showAllValidationErrors: observable.ref,
      context: observable.ref,
    }, {name: nameObservable(`FormViewerPropsStore`)})
  }

  /**
   * Applies the given FormViewerProps.
   * @param formViewerProps the properties to apply.
   */
  applyProps(formViewerProps: FormViewerProps) {
    this.view = formViewerProps.view
    this.initialData = formViewerProps.initialData ?? {}
    this.validators = formViewerProps.validators
    this.formValidators = formViewerProps.formValidators
    this.localizer = formViewerProps.localize
    this.actions = customActionsToActionsValues(formViewerProps.actions)
    this.propsLanguage = formViewerProps.language
    this.errorWrapper = formViewerProps.errorWrapper
    this.readOnly = formViewerProps.readOnly
    this.disabled = formViewerProps.disabled
    this.showAllValidationErrors = formViewerProps.showAllValidationErrors
    this.context = formViewerProps.context
  }

  /**
   * Returns the clone of the FormViewerPropsStore object.
   * @returns the clone of the FormViewerPropsStore object.
   */
  clone(): FormViewerPropsStore {
    const clone = new FormViewerPropsStore()
    clone.view = this.view
    clone.initialData = this.initialData
    clone.validators = this.validators
    clone.formValidators = this.formValidators
    clone.localizer = this.localizer
    clone.actions = this.actions
    clone.propsLanguage = this.propsLanguage
    clone.errorWrapper = this.errorWrapper
    clone.readOnly = this.readOnly
    clone.disabled = this.disabled
    clone.showAllValidationErrors = this.showAllValidationErrors
    clone.context = this.context
    return clone
  }
}
