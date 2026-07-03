import {ButtonGroup} from '@mui/material'
import {define, disabled, node, oneOfStrict, string} from '@react-form-builder/core'
import {inputsCategory} from './categories'

export const muiButtonGroup = define(ButtonGroup, 'MuiButtonGroup')
  .icon('Button')
  .category(inputsCategory)
  .props({
    children: node,
    color: string,
    orientation: oneOfStrict('vertical', 'horizontal'),
    disabled: disabled,
    variant: oneOfStrict('outlined', 'standard', 'filled')
  })
