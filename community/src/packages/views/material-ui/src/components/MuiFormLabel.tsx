import {FormLabel} from '@mui/material'
import {boolean, define, disabled, node, oneOf} from '@react-form-builder/core'
import {formCategory} from './categories'

export const muiFormLabel = define(FormLabel, 'MuiFormLabel')
  .icon('Label')
  .category(formCategory)
  .props({
    children: node,
    color: oneOf('error', 'info', 'primary', 'secondary', 'success', 'warning'),
    disabled: disabled,
    error: boolean,
    filled: boolean,
    required: boolean,
  })
