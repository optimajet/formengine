/**
 * The template component properties.
 */
export interface TemplateProps {
  /**
   * If false, nested form data show as nested object, true otherwise.
   */
  storeDataInParentForm?: boolean
  /**
   * The additional options for loading the template ({@link FormViewerProps.formOptions}).
   */
  options?: any,
  /**
   * If true, the template is disabled.
   */
  disabled?: boolean
  /**
   * If true, the template is read-only.
   */
  readOnly?: boolean
}
