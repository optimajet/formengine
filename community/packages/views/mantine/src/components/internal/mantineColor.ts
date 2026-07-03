import {oneOf} from '@react-form-builder/core'

/**
 * Mantine color palette options.
 */
export const mantineColor = oneOf(
  'blue',
  'red',
  'green',
  'yellow',
  'pink',
  'grape',
  'violet',
  'cyan',
  'teal',
  'lime',
  'orange'
)
  .default('blue')
  
