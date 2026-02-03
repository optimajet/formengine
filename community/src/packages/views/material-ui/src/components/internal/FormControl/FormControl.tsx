import type {FormControlProps} from '@mui/material'
import {FormControl, FormHelperText, InputLabel} from '@mui/material'
import {useComponentData} from '@react-form-builder/core'
import type {ChangeEvent, ComponentType} from 'react'
import {useCallback, useMemo} from 'react'
import type {DisabledProps} from '../DisabledProps'
import type {ReadOnlyProps} from '../ReadOnlyProps'
import {useLabelId} from './useLabelId'
import {useRequired} from './useRequired'

/**
 * Options for FormControl wrapper.
 */
export interface FormControlWrapperOptions {
  /**
   * The component for displaying the label.
   */
  labelComponent?: ComponentType<any>
}

/**
 * Props for the Material-UI FormControl component.
 */
export interface MuiFormControlProps extends FormControlProps, DisabledProps, ReadOnlyProps {
  /**
   * The label for the form control.
   */
  label?: string
  /**
   * If true, the form control will be required.
   */
  required?: boolean
  /**
   * The error message for the form control.
   */
  helperText?: string
}

const ErrorMessage = ({errorMessage}: { errorMessage?: string }) => {
  if (!errorMessage) return null
  return <FormHelperText>{errorMessage}</FormHelperText>
}

const FormControlWrapper = (props: MuiFormControlProps & FormControlWrapperOptions) => {
  const {children, label, labelComponent, helperText, ...otherProps} = props
  const labelId = useLabelId()
  const Label = useMemo(() => labelComponent ?? InputLabel, [labelComponent])
  return <FormControl {...otherProps}>
    {!!label && <Label id={labelId}>{label}</Label>}
    {children}
    <ErrorMessage errorMessage={helperText}/>
  </FormControl>
}

/**
 * Hook that provides form control props for Material-UI components.
 * @param props component props.
 * @returns tuple containing form control props and component props.
 */
export const useFormControlProps = (props: any): [MuiFormControlProps, any] => {
  const {label, onChange, error: errorProp, helperText: helperTextProp, ...otherProps} = props
  const {field} = useComponentData()

  const helperText = field?.error ?? helperTextProp
  const error = field?.error !== undefined || errorProp
  const required = useRequired()
  const handleChange = useCallback((event: ChangeEvent<any>) => {
    onChange?.(event.target.value)
  }, [onChange])

  return [
    {label, error, helperText, required},
    {onChange: handleChange, label, ...otherProps}
  ]
}

/**
 * HOC that wraps a component with a Material-UI FormControl.
 * @param Component the component to wrap.
 * @param options the options for FormControl wrapper.
 * @returns the wrapped component.
 */
export const withFormControl = <T extends object>(
  Component: ComponentType<T>,
  options?: FormControlWrapperOptions) => {
  const WrappedComponent = (props: T & MuiFormControlProps) => {
    const [formControlProps, componentProps] = useFormControlProps(props)
    const {id} = useComponentData()

    return <FormControlWrapper {...formControlProps} {...options}>
      <Component {...componentProps} id={id}/>
    </FormControlWrapper>
  }

  WrappedComponent.displayName = `withFormControl(${Component.displayName || Component.name})`
  return WrappedComponent
}
