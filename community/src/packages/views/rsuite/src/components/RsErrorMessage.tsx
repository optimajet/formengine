import {cx} from '@emotion/css'
import styled from '@emotion/styled'
import type {ErrorWrapperProps} from '@react-form-builder/core'
import {define, string, useAriaErrorMessage} from '@react-form-builder/core'
import {Form} from 'rsuite'
import type {TypeAttributes} from 'rsuite/esm/internals/types'
import {placement} from '../commonProperties'
import {staticCategory} from './categories'

const SDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const SErrorMessage = styled(Form.ErrorMessage)`
  z-index: 6;
`

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
  const divClassName = error ? 'rs-form-control-wrapper' : undefined
  const aria = useAriaErrorMessage()

  return <SDiv className={cx(className, divClassName)}>
    {children}
    <SErrorMessage show={Boolean(error)} placement={placement ?? 'bottomStart'} id={aria['aria-errormessage']}>
      {error}
    </SErrorMessage>
  </SDiv>
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
