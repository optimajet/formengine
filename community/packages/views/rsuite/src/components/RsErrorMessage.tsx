import type {ErrorWrapperProps} from '@react-form-builder/core'
import {define, string, useAriaErrorMessage} from '@react-form-builder/core'
import cx from 'clsx'
import {Form} from 'rsuite'
import type {TypeAttributes} from 'rsuite/esm/internals/types'
import {placement} from '../commonProperties'
import {staticCategory} from './categories'
import styles from './RsErrorMessage.module.css'

/**
 * The properties of RsErrorMessage component.
 */
export interface RsErrorMessageProps extends ErrorWrapperProps {
  /**
   * The placement of an error message.
   */
  placement?: TypeAttributes.Placement8
}

const RsErrorMessage = ({error, children, placement, className}: RsErrorMessageProps) => {
  const wrapperClassName = error ? 'rs-form-control-wrapper' : undefined
  const aria = useAriaErrorMessage()

  return (
    <div className={cx(styles.container, className, wrapperClassName)}>
      {children}
      <Form.ErrorMessage
        className={styles.errorMessage}
        show={Boolean(error)}
        placement={placement ?? 'bottomStart'}
        id={aria['aria-errormessage']}
      >
        {error}
      </Form.ErrorMessage>
    </div>
  )
}

/**
 * Metadata builder for rSuite-based error display component.
 */
export const rsErrorMessage = define(RsErrorMessage, 'RsErrorMessage')
  .name('Error message')
  .category(staticCategory)
  .props({
    placement: placement.default('bottomStart'),
    className: string,
  })
  .componentRole('error-message')
  .hideFromComponentPalette()
