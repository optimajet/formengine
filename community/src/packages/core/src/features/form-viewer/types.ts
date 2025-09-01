import type {ComponentType, ForwardedRef} from 'react'
import type {ViewMode} from '../../types'
import type {IFormData} from '../../utils/IFormData'
import type {View} from '../define'
import type {LanguageFullCode} from '../localization/types'
import type {ErrorWrapperProps} from '../validation'
import type {Validators} from '../validation/types/CustomValidationRules'
import type {ComponentLocalizer} from './ComponentLocalizer'
import type {CustomActions} from './CustomActions'
import type {FormValidators} from './FormValidators'

/**
 * Form viewer React component properties.
 */
export interface FormViewerProps {

  /**
   * Loads the form.
   * @param name the form name.
   * @param options the form options.
   * @returns the string or Promise with the form.
   */
  getForm?: (name?: string, options?: any) => string | Promise<string>

  /**
   * The form name.
   * Updating the value triggers the {@link FormViewerProps.getForm} function.
   */
  formName?: string

  /**
   * The form options. Used to transfer any options to the {@link FormViewerProps.getForm} function.
   * Updating the value triggers the {@link FormViewerProps.getForm} function.
   */
  formOptions?: any

  /**
   * All the metadata of the components of the form viewer.
   */
  view: View

  /**
   * Custom actions for the form viewer.
   */
  actions?: CustomActions

  /**
   * The set of functions that validate the form data.
   */
  formValidators?: FormValidators

  /**
   * The initial data of the form.
   */
  initialData?: Record<string, unknown>

  /**
   * The form validation errors.
   */
  errors?: Record<string, unknown>

  /**
   * The React component that wraps every component in a form. **Internal use only.**
   */
  componentWrapper?: ComponentType<any>

  /**
   * The default error wrapper used when errorType is not specified in the form.
   */
  errorWrapper?: ComponentType<ErrorWrapperProps>

  /**
   * Display resolution type.
   */
  viewMode?: ViewMode

  /**
   * The language of the form, e.g. 'en-US'.
   */
  language?: LanguageFullCode

  /**
   * The function to localize the properties of a component.
   */
  localize?: ComponentLocalizer

  /**
   * The set of metadata of validation rules, grouped by the type of value being validated.
   */
  validators?: Validators

  /**
   * The reference to {@link IFormViewer}.
   */
  viewerRef?: ForwardedRef<IFormViewer>

  /**
   * The event is called whenever a form data changes.
   * @param data the {@link IFormData} with all the form data.
   */
  onFormDataChange?: (data: IFormData) => void

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
}

/**
 * The form viewer settings interface.
 */
export interface IFormViewer {
  /**
   * @returns the {@link IFormData} with all the form data.
   */
  get formData(): IFormData
}
