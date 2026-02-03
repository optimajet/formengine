import type {SwitchProps} from '@mui/material'
import {FormControlLabel, Switch} from '@mui/material'
import {boolean, define, disabled, event, oneOf, string} from '@react-form-builder/core'
import type {SyntheticEvent} from 'react'
import {useCallback, useMemo} from 'react'
import {inputsCategory} from './categories'

/**
 * Props for the MuiSwitch component.
 */
export interface MuiSwitchProps extends Pick<SwitchProps, 'checked' | 'color' | 'disabled' | 'size'> {
  /**
   * Callback fired when the checkbox state changes.
   */
  onChange: (checked?: boolean) => void
  /**
   * The label for the radio checkbox.
   */
  label?: string
}

const MuiSwitch = ({checked, onChange, label, size, ...props}: MuiSwitchProps) => {
  const handleChange = useCallback((_: SyntheticEvent, checked: boolean) => {
    onChange?.(checked)
  }, [onChange])
  const control = useMemo(() => <Switch size={size}/>, [size])

  return <FormControlLabel checked={checked} onChange={handleChange} control={control} label={label} {...props}/>
}

export const muiSwitch = define(MuiSwitch, 'MuiSwitch')
  .icon('Toggle')
  .category(inputsCategory)
  .props({
    label: string.default('Label'),
    disabled: disabled,
    color: oneOf('primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'),
    checked: boolean.valued.uncontrolledValue(false),
    size: oneOf('small', 'medium'),
    onChange: event
  })
