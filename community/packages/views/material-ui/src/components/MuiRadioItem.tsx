import type {RadioProps} from '@mui/material'
import {FormControlLabel, Radio} from '@mui/material'
import {define, disabled, string} from '@react-form-builder/core'
import {inputsCategory} from './categories'

const control = <Radio/>

/**
 * Props for the MuiRadioItem component.
 */
export interface MuiRadioItemProps extends Pick<RadioProps, 'value' | 'color' | 'disabled'> {
  /**
   * The label for the control.
   */
  label?: string
}

const MuiRadioItem = ({value, label, ...props}: MuiRadioItemProps) => {
  return <FormControlLabel value={value} control={control} label={label} {...props}/>
}

/**
 * Material UI RadioItem component definition for the form builder.
 */
export const muiRadioItem = define(MuiRadioItem, 'MuiRadioItem')
  .icon('RadioGroup')
  .category(inputsCategory)
  .props({
    value: string,
    label: string.default('Radio item'),
    color: string,
    disabled: disabled
  })
  .wrapperCss({
    width: undefined
  })
