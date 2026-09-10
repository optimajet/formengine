import type {ButtonProps} from '@mantine/core'
import {Button} from '@mantine/core'
import {boolean, define, disabled, event, oneOf, oneOfStrict, string} from '@react-form-builder/core'
import type {ComponentProps, FC} from 'react'
import {buttonsCategory} from './internal/categories'
import {mantineColor} from './internal/mantineColor'

export const mtButton = define(
  Button as FC<ButtonProps & ComponentProps<'button'>>,
  'MtButton'
)
  .category(buttonsCategory)
  .props({
    children: string.required.default('Button').dataBound,
    variant: oneOfStrict('filled', 'default', 'outline', 'light', 'gradient', 'subtle', 'transparent', 'white')
      .default('filled'),
    size: oneOf(
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      'compact-xs',
      'compact-sm',
      'compact-md',
      'compact-lg',
      'compact-xl'
    ).default('sm'),
    color: mantineColor,
    disabled: disabled.default(false),
    fullWidth: boolean
      .default(false),
    loading: boolean.default(false),
    // leftSection: node,
    // rightSection: node,
    radius: string,
    justify: oneOf('center', 'start', 'end', 'space-between', 'space-around', 'space-evenly')
      .default('center'),
    autoContrast: boolean.default(false),
    type: oneOf('button', 'submit', 'reset').default('button'),
    onClick: event,
  })
