import {Checkbox} from '@mantine/core'
import {boolean, define, disabled, string} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import {checkedEventHandlers} from './internal/checkedEventHandlers'
import {mantineColor} from './internal/mantineColor'
import {description, filledVariant, labelPosition, onChange, size} from './internal/sharedProps'

export const mtCheckbox = define(Checkbox, 'MtCheckbox')
  .category(inputsCategory)
  .props({
    label: string.default('Checkbox'),
    checked: boolean.valued.uncontrolledValue(false),
    indeterminate: boolean.default(false),
    disabled: disabled.default(false),
    labelPosition,
    description,
    size,
    color: mantineColor,
    radius: string,
    // icon: node,
    // iconColor: string,
    variant: filledVariant,
    onChange,
  })
  .overrideEventHandlers(checkedEventHandlers)
