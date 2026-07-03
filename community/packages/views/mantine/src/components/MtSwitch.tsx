import {Switch} from '@mantine/core'
import {boolean, define, disabled, node, string} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import {checkedEventHandlers} from './internal/checkedEventHandlers'
import {mantineColor} from './internal/mantineColor'
import {description, labelPosition, onChange, size} from './internal/sharedProps'

export const mtSwitch = define(Switch, 'MtSwitch')
  .category(inputsCategory)
  .props({
    label: string.default('Switch'),
    checked: boolean.valued.uncontrolledValue(false),
    disabled: disabled.default(false),
    labelPosition,
    description,
    size,
    color: mantineColor,
    radius: string,
    withThumbIndicator: boolean.default(false),
    onLabel: string,
    offLabel: string,
    thumbIcon: node,
    onChange,
  })
  .overrideEventHandlers(checkedEventHandlers)
