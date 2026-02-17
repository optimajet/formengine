import type {SwitchGroupProps} from '@mantine/core'
import {Group, Switch} from '@mantine/core'
import {array, define, disabled, required, string, toLabeledValues,} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import type {GroupLayoutProps} from './internal/groupLayoutProps'
import {groupLayoutProps} from './internal/groupLayoutProps'
import type {IOption} from './internal/IOption'
import {description, labelPosition, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtSwitchGroup component.
 */
export interface MtSwitchGroupProps extends Omit<SwitchGroupProps, 'children'>, GroupLayoutProps {
  /**
   * Array of switch options with value and label.
   */
  items: IOption[]

  /**
   * Switch label position.
   */
  labelPosition?: 'left' | 'right'
}

/**
 * Mantine switch group component for React Form Builder.
 * @param props component properties.
 * @returns switch group component.
 */
export function MtSwitchGroup(props: MtSwitchGroupProps) {
  const {items, labelPosition, gap, align, justify, wrap, grow, ...others} = props

  return (
    <Switch.Group {...others}>
      <Group pt={5} gap={gap} align={align} justify={justify} wrap={wrap} grow={grow}>
        {items.map((item) => (
          <Switch
            key={item.value}
            value={item.value}
            label={item.label}
            labelPosition={labelPosition}
          />
        ))}
      </Group>
    </Switch.Group>
  )
}

export const mtSwitchGroup = define(MtSwitchGroup, 'MtSwitchGroup')
  .category(inputsCategory)
  .props({
    label: string.default('Switch Group'),
    description: description,
    error: string,
    value: array.valued,
    items: array
      .default(toLabeledValues(['Option 1', 'Option 2', 'Option 3'])),
    size: size,
    labelPosition: labelPosition,
    ...groupLayoutProps,
    disabled: disabled.default(false),
    withAsterisk: required,
    onChange: onChange,
  })
