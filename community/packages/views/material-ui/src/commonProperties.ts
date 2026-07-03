import type {PopperProps, TypographyProps} from '@mui/material'
import {boolean, fn, oneOfStrict} from '@react-form-builder/core'

type Placement = NonNullable<PopperProps['placement']>

export const sx = fn(`/**
 * @param {object} theme
 * @returns {object|array}
 */
function sx(theme) {`)

export const placement = oneOfStrict<Placement>(
  'auto-end',
  'auto-start',
  'auto',
  'bottom-end',
  'bottom-start',
  'bottom',
  'left-end',
  'left-start',
  'left',
  'right-end',
  'right-start',
  'right',
  'top-end',
  'top-start',
  'top',
)

export const size = oneOfStrict(
  'small',
  'medium',
  'large'
).default('medium')

export const color = oneOfStrict(
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
  'textPrimary',
  'textSecondary',
  'textDisabled'
)

export const typography: Partial<Record<keyof TypographyProps, any>> = {
  variant: oneOfStrict(
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline'
  ),
  color: color,
  textAlign: oneOfStrict('left', 'center', 'right', 'justify'),
  noWrap: boolean,
  gutterBottom: boolean,
}
