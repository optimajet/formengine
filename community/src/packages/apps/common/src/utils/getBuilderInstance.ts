import type {FormBuilderProps, IFormBuilder} from '@react-form-builder/designer'

/**
 * Extracts the form builder instance from a React ref.
 * @param builderRef the React ref object for the form builder.
 * @returns the form builder instance or null.
 */
export function getBuilderInstance(builderRef?: FormBuilderProps['builderRef']): IFormBuilder | null {
  if (!builderRef) return null
  if (typeof builderRef === 'function') return null
  return builderRef.current
}
