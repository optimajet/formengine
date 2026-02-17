import {Radio} from '@mantine/core'
import {boolean, define, disabled, string} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import {checkedEventHandlers} from './internal/checkedEventHandlers'
import {mantineColor} from './internal/mantineColor'
import {description, labelPosition, onChange, size} from './internal/sharedProps'

export const mtRadio = define(Radio, 'MtRadio')
  .category(inputsCategory)
  .props({
    label: string.default('Radio'),
    checked: boolean.valued.uncontrolledValue(false),
    disabled: disabled.default(false),
    labelPosition,
    description,
    size,
    color: mantineColor,
    radius: string,
    // icon: node,
    // iconColor: string,
    onChange,
  })
  .overrideEventHandlers(checkedEventHandlers)
