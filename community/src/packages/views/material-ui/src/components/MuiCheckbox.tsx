import type {CheckboxProps, FormControlLabelProps} from '@mui/material'
import {Checkbox, FormControlLabel} from '@mui/material'
import {boolean, define, disabled, event, string} from '@react-form-builder/core'
import {useCallback, useMemo} from 'react'
import {size} from '../commonProperties'
import {inputsCategory} from './categories'

type OnChange = NonNullable<FormControlLabelProps['onChange']>

/**
 * Props for the MuiCheckbox component.
 */
export interface MuiCheckboxProps extends Pick<CheckboxProps, 'checked' | 'color' | 'disabled' | 'size'> {
  /**
   * Callback fired when the checkbox state changes.
   */
  onChange: (checked?: boolean) => void
  /**
   * The label for the radio checkbox.
   */
  label?: string
}

const MuiCheckbox = ({checked, onChange, label, size, ...props}: MuiCheckboxProps) => {
  const handleChange = useCallback<OnChange>((_, checked) => {
    onChange?.(checked)
  }, [onChange])
  
  const control = useMemo(() => <Checkbox size={size}/>, [size])

  return <FormControlLabel checked={checked} onChange={handleChange} control={control} label={label} {...props}/>
}

/**
 * Material UI Checkbox component definition for the form builder.
 */
export const muiCheckbox = define(MuiCheckbox, 'MuiCheckbox')
  .icon('Checkbox')
  .category(inputsCategory)
  .props({
    label: string.default('Checkbox label'),
    checked: boolean.valued.uncontrolledValue(false),
    color: string,
    disabled: disabled,
    size,
    onChange: event,
  })
