import type {ErrorWrapperProps} from '@react-form-builder/core'
import {define} from '@react-form-builder/core'
import {feedbackCategory} from './categories'

/**
 * A wrapper component for displaying error messages in Material-UI forms.
 * @param props the properties for the ErrorWrapper component.
 * @param props.children the child elements to be rendered inside the error wrapper.
 * @returns the React fragment containing the child elements.
 */
export const MuiErrorWrapper = (props: ErrorWrapperProps) => <>
  {props.children}
</>

export const muiErrorWrapper = define(MuiErrorWrapper, 'MuiErrorWrapper')
  .icon('ErrorMessage')
  .category(feedbackCategory)
  .componentRole('error-message')
  .hideFromComponentPalette()
