import type {LabeledValue} from '@react-form-builder/core'
import {array, boolean, define, disabled, event, oneOf, string, toLabeledValues} from '@react-form-builder/core'
import type {RadioGroupProps} from 'rsuite'
import {Radio, RadioGroup} from 'rsuite'
import {readOnly} from '../commonProperties'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

/**
 * Props for the RsRadioGroup component.
 */
export interface RsRadioGroupProps extends RadioGroupProps<string> {
  /**
   * The items for the radio group.
   */
  items: LabeledValue[]
  /**
   * The label for the radio group.
   */
  label?: string
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: string) => void
}

/**
 * Radio group component with label support.
 * @param props the component props.
 * @param props.items the items for the radio group.
 * @param props.label the label for the radio group.
 * @param props.value the value of the radio group.
 * @param props.className the CSS class name.
 * @param props.props the additional radio group props.
 * @returns the React element.
 */
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
  .category(fieldsCategory)
  .props({
    name: string.default('RadioGroup').hinted('Radio group name'),
    appearance: oneOf('default', 'picker').labeled('Default', 'Picker').default('default')
      .withEditorProps({creatable: false}),
    label: string.default('Radio'),
    disabled: disabled.hinted('The disable of component').default(false),
    readOnly,
    inline: boolean.default(false),
    onChange: event,
    items: array.default(toLabeledValues(['a', 'b', 'c'])),
    value: string.valued.hinted('Radio group value')
  })

