import {Stack, Text} from '@mantine/core'
import type {ErrorWrapperProps} from '@react-form-builder/core'
import {define, useAriaErrorMessage, useComponentData} from '@react-form-builder/core'
import clsx from 'clsx'
import type {ReactElement} from 'react'
import {Children, cloneElement, isValidElement} from 'react'
import styles from './MtErrorWrapper.module.css'

const useWrappedComponentDeclaresError = () => {
  const data = useComponentData()
  const defaultProps = data?.model?.defaultProps

  return Boolean(defaultProps && 'error' in defaultProps)
}

/**
 * A wrapper component for displaying error messages in Mantine forms.
 * Combines native Mantine error display with the form builder error wrapper:
 * - Injects the error prop into the single child so Mantine controls show native error state (e.g. red border, error message).
 * - Optionally shows error text below the control for children that do not support the error prop or for a11y.
 * @param props the properties for the error wrapper component.
 * @param props.error the error text to display.
 * @param props.children the wrapped form control.
 * @param props.className optional CSS class name.
 * @returns the Stack containing the control (with error prop when possible) and optionally the error message.
 */
export const MtErrorWrapper = ({error, children, className}: ErrorWrapperProps) => {
  const aria = useAriaErrorMessage()
  const declaresError = useWrappedComponentDeclaresError()
  const showMessage = !declaresError
  const cls = clsx(styles.errorWrapper, className)

  const child = children != null ? Children.only(children) : null
  const childWithError =
    child != null && error && isValidElement(child) && declaresError
      ? cloneElement(child as ReactElement<{ error?: string }>, {error})
      : child

  return (
    <Stack className={cls} gap={4}>
      {childWithError}
      {error && showMessage && (
        <Text id={aria['aria-errormessage']} role="alert"
              size="var(--input-error-size, calc(var(--mantine-font-size-sm) - calc(0.125rem * var(--mantine-scale))))"
              c="var(--mantine-color-error)">
          {error}
        </Text>
      )}
    </Stack>
  )
}

MtErrorWrapper.displayName = 'MtErrorWrapper'

export const mtErrorWrapper = define(MtErrorWrapper, 'MtErrorWrapper')
  .componentRole('error-message')
  .hideFromComponentPalette()
