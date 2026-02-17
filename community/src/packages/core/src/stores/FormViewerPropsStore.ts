import {makeObservable, observable} from 'mobx'
import type {ComponentType} from 'react'
import type {IView} from '../features/define/utils/IView'
import type {ActionValues} from '../features/event/ActionValues'
import type {ComponentLocalizer} from '../features/form-viewer/ComponentLocalizer'
import {customActionsToActionsValues} from '../features/form-viewer/CustomActions'
import type {FormValidators} from '../features/form-viewer/FormValidators'
import type {FormViewerProps} from '../features/form-viewer/types'
import type {ILocalizationEngine} from '../features/localization/ILocalizationEngine'
import type {LanguageFullCode} from '../features/localization/language'
import type {ErrorWrapperProps} from '../features/validation/components/DefaultErrorMessage'
import type {Validators} from '../features/validation/types/CustomValidationRules'
import {nameObservable} from '../utils/observableNaming'

/**
 * Represents the props passed to the FormViewer Store. **Internal use only.**
 */
export class FormViewerPropsStore {
  /**
   * The metadata of the form viewer components.
   */
  view: IView
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
   * The arbitrary internal context.
   */
  context?: any

  /**
   * The initial user-defined state.
   */
  initialState: Record<string, unknown> = {}

  /**
   * The arbitrary user context passed via props.
   * This value is not observable and is intended to be non-reactive.
   */
  userContext?: unknown

  /**
   * The localization engine provided via FormViewer props.
   */
  localizationEngine?: ILocalizationEngine

  /**
   * Constructs a new FormViewerPropsStore from the given FormViewerProps.
   * @param formViewerProps the FormViewer props.
   * @returns the FormViewerPropsStore.
   */
  constructor(formViewerProps: FormViewerProps) {
    this.applyProps(formViewerProps)
    this.view = formViewerProps.view

    makeObservable(this, {
      view: observable.ref,
      initialData: observable.deep,
      initialState: observable.deep,
      userContext: observable.deep,
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
      localizationEngine: observable.ref,
    }, {name: nameObservable(`FormViewerPropsStore`)})
  }

  /**
   * Applies the given FormViewerProps.
   * @param formViewerProps the properties to apply.
   */
  applyProps(formViewerProps: FormViewerProps) {
    this.view = formViewerProps.view
    this.initialData = formViewerProps.initialData ?? {}
    this.initialState = formViewerProps.initialState ?? {}
    this.userContext = formViewerProps.userContext
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
    this.localizationEngine = formViewerProps.localizationEngine
  }

  /**
   * Returns the clone of the FormViewerPropsStore object.
   * @returns the clone of the FormViewerPropsStore object.
   */
  clone(): FormViewerPropsStore {
    return new FormViewerPropsStore({
      view: this.view,
      initialData: this.initialData,
      initialState: this.initialState,
      userContext: this.userContext,
      validators: this.validators,
      formValidators: this.formValidators,
      localize: this.localizer,
      actions: this.actions,
      language: this.propsLanguage,
      errorWrapper: this.errorWrapper,
      readOnly: this.readOnly,
      disabled: this.disabled,
      showAllValidationErrors: this.showAllValidationErrors,
      context: this.context,
      localizationEngine: this.localizationEngine,
    })
  }
}
