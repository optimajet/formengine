import {Chip} from '@mantine/core'
import {boolean, define, disabled, oneOfStrict, string} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import {mantineColor} from './internal/mantineColor'
import {onChange, size} from './internal/sharedProps'

export const mtChip = define(Chip, 'MtChip')
  .category(inputsCategory)
  // TODO FE-1803 add support for icon, and wrapperProps.
  .props({
    children: string.default('Chip'),
    checked: boolean.valued.uncontrolledValue(false),
    disabled: disabled.default(false),
    variant: oneOfStrict('filled', 'outline', 'light').default('filled'),
    size,
    color: mantineColor,
    radius: string,
    onChange,
  })
