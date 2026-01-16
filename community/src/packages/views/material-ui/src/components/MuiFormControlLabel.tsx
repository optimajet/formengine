import type {FormControlLabelProps} from '@mui/material'
import {Checkbox, FormControlLabel, Switch} from '@mui/material'
import {boolean, define, disabled, event, oneOf, oneOfStrict, string} from '@react-form-builder/core'
import type {ComponentType} from 'react'
import {useCallback, useMemo} from 'react'
import {formCategory} from './categories'

type OnChange = NonNullable<FormControlLabelProps['onChange']>

/**
 * Props for the MuiFormControlLabel component.
 */
export interface MuiFormControlLabelProps extends Omit<FormControlLabelProps, 'control' | 'onChange'> {
  /**
   * Type of control to use (Checkbox, Radio, or Switch).
   */
  control: string
  /**
   * Callback fired when the control state changes.
   */
  onChange: (checked?: boolean) => void
}

/**
 * Mapping of control types to their corresponding components.
 */
const controlMap: Record<string, ComponentType> = {
  Checkbox,
  Switch
}

/**
 * Material-UI FormControlLabel component for form builder.
 * @param props component properties.
 * @returns form control label component.
 */
const MuiFormControlLabel = (props: MuiFormControlLabelProps) => {
  const {control, value, checked, onChange, ...otherProps} = props
  const controlElement = useMemo(() => {
    const Component = controlMap[control] ?? Checkbox
    return <Component/>
  }, [control])

  const handleChange = useCallback<OnChange>((_, checked) => {
    onChange?.(checked)
  }, [onChange])

  return <FormControlLabel value={value} checked={checked} onChange={handleChange} control={controlElement} {...otherProps}></FormControlLabel>
}

export const muiFormControlLabelType = 'MuiFormControlLabel'

export const muiFormControlLabel = define(MuiFormControlLabel, muiFormControlLabelType)
  .icon('Label')
  .category(formCategory)
  .props({
    control: oneOfStrict(...Object.keys(controlMap))
      .setup({required: true}),
    value: string,
    checked: boolean.valued.uncontrolledValue(false),
    disabled: disabled,
    disableTypography: boolean,
    label: string.required.default('Label'),
    labelPlacement: oneOf('bottom', 'end', 'start', 'top').default('end'),
    onChange: event
  })
