import {event, number, oneOf, oneOfStrict, string} from '@react-form-builder/core'

export const description = string

export const dropdownType = oneOfStrict('popover', 'modal').default('popover')

export const label = string.default('Label')

export const labelPosition = oneOf('left', 'right').default('right')

export const minRows = number.default(3)

export const onChange = event

// TODO FE-1803 split size declarations for different components
export const size = oneOf('xs', 'sm', 'md', 'lg', 'xl').default('sm')

export const filledVariant = oneOfStrict('filled', 'outline').default('filled')

export const floatingPosition = oneOfStrict(
  'top',
  'right',
  'bottom',
  'left',
  'top-start',
  'top-end',
  'right-start',
  'right-end',
  'bottom-start',
  'bottom-end',
  'left-start',
  'left-end'
)
