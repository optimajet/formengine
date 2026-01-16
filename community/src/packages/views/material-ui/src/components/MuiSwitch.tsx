import {Switch} from '@mui/material'
import {boolean, define, disabled, oneOf} from '@react-form-builder/core'
import {inputsCategory} from './categories'

// todo label only with FormControlLabel
export const muiSwitch = define(Switch, 'MuiSwitch')
  .icon('Toggle')
  .category(inputsCategory)
  .props({
    // label: string,
    color: oneOf('primary', 'secondary', 'error', 'info', 'success', 'warning', 'default'),
    checked: boolean.valued.uncontrolledValue(false),
    disabled: disabled,
    size: oneOf('small', 'medium')
  })
