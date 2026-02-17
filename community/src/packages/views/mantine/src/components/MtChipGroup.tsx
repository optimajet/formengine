import type {ChipGroupProps, ChipVariant, InputWrapperProps} from '@mantine/core'
import {Chip, Group, Input} from '@mantine/core'
import {array, define, disabled, required, string, toLabeledValues,} from '@react-form-builder/core'
import {inputsCategory} from './internal/categories'
import type {GroupLayoutProps} from './internal/groupLayoutProps'
import {groupLayoutProps} from './internal/groupLayoutProps'
import type {IOption} from './internal/IOption'
import {description, filledVariant, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtChipGroup component.
 */
export interface MtChipGroupProps<Multiple extends boolean = false>
  extends Omit<InputWrapperProps, 'children' | keyof ChipGroupProps<Multiple>>,
    ChipGroupProps<Multiple>,
    GroupLayoutProps {
  /**
   * Array of chip options with value and label.
   */
  items: IOption[]

  /**
   * Chip variant.
   */
  variant?: ChipVariant

  /**
   * Chips disabled state.
   */
  disabled?: boolean
}

/**
 * Mantine chip group component for React Form Builder.
 * @param props component properties.
 * @returns chip group component.
 */
export function MtChipGroup<Multiple extends boolean>(props: MtChipGroupProps<Multiple>) {
  const {
    items,
    variant,
    disabled,
    value,
    defaultValue,
    onChange,
    multiple,
    gap,
    align,
    justify,
    wrap,
    grow,
    ...others
  } = props

  return (
    <Input.Wrapper {...others}>
      <Group pt={5} gap={gap} align={align} justify={justify} wrap={wrap} grow={grow}>
        <Chip.Group
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          multiple={multiple}
        >
          {items.map((item) => (
            <Chip key={item.value} value={item.value} variant={variant} disabled={disabled}>
              {item.label}
            </Chip>
          ))}
        </Chip.Group>
      </Group>
    </Input.Wrapper>
  )
}

/**
 * Mantine chip radio group component for React Form Builder.
 * @param props component properties.
 * @returns chip radio group component.
 */
export function MtChipRadioGroup(props: Omit<MtChipGroupProps, 'multiple'>) {
  return <MtChipGroup {...props} multiple={false}/>
}

/**
 * Mantine chip checkbox group component for React Form Builder.
 * @param props component properties.
 * @returns chip checkbox group component.
 */
export function MtChipCheckboxGroup(props: Omit<MtChipGroupProps<true>, 'multiple'>) {
  return <MtChipGroup {...props} multiple/>
}

export const mtChipRadioGroup = define(MtChipRadioGroup, 'MtChipRadioGroup')
  .category(inputsCategory)
  .props({
    label: string.default('Chip Radio Group'),
    description: description,
    error: string,
    value: string.valued,
    items: array
      .default(toLabeledValues(['Option 1', 'Option 2', 'Option 3'])),
    variant: filledVariant,
    size: size,
    ...groupLayoutProps,
    disabled: disabled.default(false),
    withAsterisk: required,
    onChange: onChange,
  })

export const mtChipCheckboxGroup = define(MtChipCheckboxGroup, 'MtChipCheckboxGroup')
  .category(inputsCategory)
  .props({
    label: string.default('Chip Group'),
    description: description,
    error: string,
    value: array.valued,
    items: array
      .default(toLabeledValues(['Option 1', 'Option 2', 'Option 3'])),
    variant: filledVariant,
    size: size,
    ...groupLayoutProps,
    disabled: disabled.default(false),
    withAsterisk: required,
    onChange: onChange,
  })
