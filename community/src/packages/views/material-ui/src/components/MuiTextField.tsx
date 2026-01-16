import {TextField} from '@mui/material'
import {boolean, define, number, oneOfStrict, string} from '@react-form-builder/core'
import type {ComponentProps} from 'react'
import {inputsCategory} from './categories'
import {formControlProperties} from './internal/FormControl/defineFormControl'
import {useFormControlProps} from './internal/FormControl/FormControl'

/**
 * Props for the MuiTextField component.
 */
export type MuiTextFieldProps = ComponentProps<typeof TextField> & {
  /**
   * Callback function when the text field value changes.
   */
  onChange?: (value: string) => void
}

/**
 * Material-UI TextField component for form builder.
 * @param props component properties.
 * @returns text field component.
 */
const MuiTextField = (props: MuiTextFieldProps) => {
  const [formControlProps, componentProps] = useFormControlProps(props)
  return <TextField {...formControlProps} {...componentProps}/>
}

export const muiTextField = define(MuiTextField, 'MuiTextField')
  .icon('Input')
  .category(inputsCategory)
  .props({
    value: string.valued.uncontrolledValue(''),
    multiline: boolean,
    maxRows: number,
    ...formControlProperties,
    variant: oneOfStrict('outlined', 'standard', 'filled'),
    size: oneOfStrict('small', 'medium'),
    margin: oneOfStrict('dense', 'normal', 'none')
  })
