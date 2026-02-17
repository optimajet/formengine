import type {RadioGroupProps} from '@mantine/core'
import {Group, Radio} from '@mantine/core'
import {array, define, disabled, required, string, toLabeledValues} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import type {GroupLayoutProps} from './internal/groupLayoutProps'
import {groupLayoutProps} from './internal/groupLayoutProps'
import type {IOption} from './internal/IOption'
import {description, labelPosition, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtRadioGroup component.
 */
export interface MtRadioGroupProps extends Omit<RadioGroupProps, 'children'>, GroupLayoutProps {
  /**
   * Array of radio options with value and label.
   */
  items: IOption[]

  /**
   * Radio label position.
   */
  labelPosition?: 'left' | 'right'
}

/**
 * Mantine radio group component for React Form Builder.
 * @param props component properties.
 * @returns radio group component.
 */
export function MtRadioGroup(props: MtRadioGroupProps) {
  const {items, labelPosition, gap, align, justify, wrap, grow, ...others} = props

  return (
    <Radio.Group {...others}>
      <Group pt={5} gap={gap} align={align} justify={justify} wrap={wrap} grow={grow}>
        {items.map((item) => (
          <Radio
            key={item.value}
            value={item.value}
            label={item.label}
            labelPosition={labelPosition}
          />
        ))}
      </Group>
    </Radio.Group>
  )
}

export const mtRadioGroup = define(MtRadioGroup, 'MtRadioGroup')
  .category(inputsCategory)
  .props({
    label: string.default('Radio Group'),
    description: description,
    error: string,
    value: string.valued,
    items: array
      .default(toLabeledValues(['Option 1', 'Option 2', 'Option 3'])),
    size: size,
    labelPosition: labelPosition,
    ...groupLayoutProps,
    disabled: disabled.default(false),
    withAsterisk: required,
    onChange: onChange,
  })
