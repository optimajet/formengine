import type {LabeledValue} from '@react-form-builder/core'
import {array, boolean, define, disabled, event, oneOf, string, toLabeledValues} from '@react-form-builder/core'
import type {RadioGroupProps} from 'rsuite'
import {Radio, RadioGroup} from 'rsuite'
import {readOnly} from '../commonProperties'
import {Labeled} from './components/Labeled'

interface RsRadioGroupProps extends RadioGroupProps<string> {
  items: LabeledValue[]
  label?: string
}

const RsRadioGroup = ({items, label, value, className, ...props}: RsRadioGroupProps) => {
  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <RadioGroup {...props as any} value={value ?? ''}>
        {items.map(({value, label}, i) => (
          <Radio value={value} key={i}>{label ?? value}</Radio>
        ))
        }
      </RadioGroup>
    </Labeled>
  )
}

export const rsRadioGroup = define(RsRadioGroup, 'RsRadioGroup')
  .name('Radio group')
  .props({
    name: string.default('RadioGroup').hinted('Radio group name'),
    appearance: oneOf('default', 'picker').labeled('Default', 'Picker').default('default'),
    label: string.default('Radio'),
    disabled: disabled.hinted('The disable of component').default(false),
    readOnly,
    inline: boolean.default(false),
    onChange: event,
    items: array.default(toLabeledValues(['a', 'b', 'c'])),
    value: string.valued.hinted('Radio group value')
  })

