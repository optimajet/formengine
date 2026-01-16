import type {ButtonProps} from '@mui/material'
import {Button} from '@mui/material'
import {boolean, define, disabled, event, oneOfStrict, string, useBuilderValue} from '@react-form-builder/core'
import {color, size} from '../commonProperties'
import {inputsCategory} from './categories'

const defaultContent = 'Button'

const MuiButton = ({children, ...props}: ButtonProps) => {
  const content = useBuilderValue(children, defaultContent)
  return <Button {...props}>{content}</Button>
}

export const muiButton = define(MuiButton, 'MuiButton')
  .icon('Button')
  .category(inputsCategory)
  .props({
    children: string.default(defaultContent).dataBound,
    color: color,
    disabled: disabled,
    disableElevation: boolean,
    loading: boolean,
    variant: oneOfStrict('contained', 'outlined', 'text'),
    size,
    onClick: event,
  })
