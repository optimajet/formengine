import {css, cx} from '@emotion/css'
import type {ReactNode} from 'react'
import {useAriaErrorMessage} from '../../../utils/useAriaAttributesIds'
import {Model} from '../../define'
import {addOrUpdateFeature} from '../../define/utils/ComponentFeature'
import {cfComponentRole} from '../../define/utils/integratedComponentFeatures'

/**
 * Properties of the React component that wraps the form view component and displays validation errors.
 */
export interface ErrorWrapperProps {
  /**
   * The error text.
   */
  error?: string
  /**
   * The wrapped component.
   */
  children?: ReactNode
  /**
   * The CSS class name.
   */
  className?: string
}

const ErrorMessageStyle = css`
  font-size: 12px;
  color: var(--red-600);
  margin-top: 0.25rem;

  &:before {
    content: "❌ ";
    font-size: 10px;
    padding: 6px;
  }

  @media (prefers-color-scheme: dark) {
    color: var(--red-300);
  }
`

const divClass = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const DefaultErrorMessage = ({children, error, className}: ErrorWrapperProps) => {
  const aria = useAriaErrorMessage()
  return (
    <div className={divClass}>
      {children}
      {error && <p id={aria['aria-errormessage']} className={cx(className, ErrorMessageStyle)} children={error}/>}
    </div>
  )
}
DefaultErrorMessage.displayName = 'DefaultErrorMessage'

const errorMessageFeatures = addOrUpdateFeature({}, cfComponentRole, 'error-message')

/**
 * The component metadata for error message. **Internal use only.**
 */
export const errorMessageModel = new Model(DefaultErrorMessage, undefined, undefined, undefined,
  undefined, undefined, undefined, undefined, undefined, undefined,
  undefined, undefined, undefined, undefined, undefined, errorMessageFeatures)
