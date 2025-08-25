import type {ActionValues} from '../features/event'
import type {Language} from '../features/localization/types'
import type {ComponentStore} from './ComponentStore'
import type {LocalizationValue} from './LocalizationStore'

/**
 * The version of the saved form.
 */
export enum PersistedFormVersion {
  version1 = '1'
}

/**
 * The format for saving a form designed in Form Builder.
 */
export interface PersistedForm {

  /**
   * The version of the saved form.
   */
  version?: PersistedFormVersion

  /**
   * Represents a set of action definitions.
   */
  actions?: ActionValues,

  /**
   * The form validator.
   */
  formValidator?: string

  /**
   * Properties of the component displaying the error.
   */
  errorProps?: any,

  /**
   * Name of the type of component that displays the modal.
   */
  modalType?: string,

  /**
   * Name of the type of component that displays the tooltip.
   */
  tooltipType?: string,

  /**
   * Name of the type of component displaying the error.
   */
  errorType?: string,

  /**
   * Settings for components that display the form.
   */
  form: ComponentStore,

  /**
   * Localization of the form.
   */
  localization: LocalizationValue,

  /**
   * Form languages.
   */
  languages: Language[],

  /**
   * The default form language.
   */
  defaultLanguage: string
}
