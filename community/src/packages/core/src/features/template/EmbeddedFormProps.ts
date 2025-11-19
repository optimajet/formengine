/**
 * The embedded form component properties.
 */
export interface EmbeddedFormProps {
  /**
   * If false, nested form data show as nested object, true otherwise.
   */
  storeDataInParentForm?: boolean
  /**
   * The form name ({@link FormViewerProps.formName}).
   */
  formName?: string
  /**
   * The additional options for loading the embedded form ({@link FormViewerProps.formOptions}).
   */
  options?: any
  /**
   * If true, the embedded form is disabled.
   */
  disabled?: boolean
  /**
   * If true, the embedded form is read-only.
   */
  readOnly?: boolean
}
