import type {TextFieldProps} from '@mui/material'
import {TextField} from '@mui/material'
import {boolean, define, number, oneOfStrict, readOnly, string} from '@react-form-builder/core'
import type {HTMLInputTypeAttribute} from 'react'
import {useMemo} from 'react'
import {inputsCategory} from './categories'
import {formControlProperties} from './internal/FormControl/defineFormControl'
import {useFormControlProps} from './internal/FormControl/FormControl'
import type {MuiControlProps} from './internal/FormControl/types'
import {useReadOnlySlotProp} from './internal/useReadOnlySlotProp'

const getLabelProps = (type?: HTMLInputTypeAttribute) => {
  if (!type || ['text', 'number', 'password'].includes(type)) return
  return {shrink: true}
}

const getStyleProps = (inputType?: HTMLInputTypeAttribute) => {
  if (inputType === 'range') {
    return {
      style: {
        paddingInline: '15px'
      }
    }
  }
}

/**
 * Props for the MuiTextField component.
 */
export type MuiTextFieldProps = TextFieldProps & MuiControlProps & {
  /**
   * If true, the form control will be read-only.
   */
  readOnly?: boolean
  /**
   * Callback function when the text field value changes.
   */
  onChange?: (value: string) => void
}

const useInputSlotProps = (props: MuiTextFieldProps) => {
  const {type, readOnly} = props
  const readOnlyProp = useReadOnlySlotProp(readOnly)

  return useMemo(() => ({
    input: {
      ...readOnlyProp?.input,
      ...getStyleProps(type)
    },
    inputLabel: getLabelProps(type)
  }), [type, readOnlyProp?.input])
}

const MuiTextField = (props: MuiTextFieldProps) => {
  const [formControlProps, componentProps] = useFormControlProps(props)
  const slotProps = useInputSlotProps(props)

  return <TextField {...formControlProps} {...componentProps} slotProps={slotProps}/>
}

export const muiTextField = define(MuiTextField, 'MuiTextField')
  .icon('Input')
  .category(inputsCategory)
  .props({
    value: string.valued.uncontrolledValue(''),
    type: oneOfStrict(
      'text', 'number', 'password', 'date', 'time', 'datetime-local', 'month', 'week', 'range', 'color'
    ).default('text'),
    multiline: boolean,
    maxRows: number,
    variant: oneOfStrict('standard', 'outlined', 'filled'),
    ...formControlProperties,
    readOnly: readOnly,
    size: oneOfStrict('small', 'medium'),
    margin: oneOfStrict('dense', 'normal', 'none')
  })
