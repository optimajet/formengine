import type {CheckboxGroupProps} from '@mantine/core'
import {Checkbox, Group} from '@mantine/core'
import {array, define, disabled, required, string, toLabeledValues,} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import type {GroupLayoutProps} from './internal/groupLayoutProps'
import {groupLayoutProps} from './internal/groupLayoutProps'
import type {IOption} from './internal/IOption'
import {description, filledVariant, labelPosition, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtCheckboxGroup component.
 */
export interface MtCheckboxGroupProps extends Omit<CheckboxGroupProps, 'children'>, GroupLayoutProps {
  /**
   * Array of checkbox options with value and label.
   */
  items: IOption[]

  /**
   * Checkbox label position.
   */
  labelPosition?: 'left' | 'right'
}

/**
 * Mantine checkbox group component for React Form Builder.
 * @param props component properties.
 * @returns checkbox group component.
 */
export function MtCheckboxGroup(props: MtCheckboxGroupProps) {
  const {
    items,
    variant,
    labelPosition,
    gap,
    align,
    justify,
    wrap,
    grow,
    ...others
  } = props

  return (
    <Checkbox.Group {...others}>
      <Group pt={5} gap={gap} align={align} justify={justify} wrap={wrap} grow={grow}>
        {items.map((item) => (
          <Checkbox
            key={item.value}
            value={item.value}
            label={item.label}
            variant={variant}
            labelPosition={labelPosition}
          />
        ))}
      </Group>
    </Checkbox.Group>
  )
}

export const mtCheckboxGroup = define(MtCheckboxGroup, 'MtCheckboxGroup')
  .category(inputsCategory)
  .props({
    label: string.default('Checkbox Group'),
    description: description,
    error: string,
    value: array.valued,
    items: array
      .default(toLabeledValues(['Option 1', 'Option 2', 'Option 3'])),
    variant: filledVariant,
    size: size,
    labelPosition: labelPosition,
    ...groupLayoutProps,
    disabled: disabled.default(false),
    withAsterisk: required,
    onChange: onChange,
  })
