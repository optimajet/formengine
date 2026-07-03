import type {InputWrapperProps} from '@mantine/core'
import {Input} from '@mantine/core'
import type {DatePickerType, MonthPickerProps} from '@mantine/dates'
import {MonthPicker} from '@mantine/dates'
import {array, boolean, define, number, oneOf, oneOfStrict, required, string} from '@react-form-builder/core'
import {datesCategory} from './internal/categories'
import {description, label, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtMonthPicker component.
 */
export interface MtMonthPickerProps<Type extends DatePickerType = 'default'>
  extends MonthPickerProps<Type>,
    Omit<InputWrapperProps, 'children' | keyof MonthPickerProps<Type>> {
}

/**
 * Mantine month picker component for React Form Builder.
 * @param props component properties.
 * @returns month picker component.
 */
export function MtMonthPicker<Type extends DatePickerType = 'default'>(props: MtMonthPickerProps<Type>) {
  const {
    label,
    description,
    error,
    id,
    required,
    withAsterisk,
    ...others
  } = props

  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error}
      id={id}
      required={required}
      withAsterisk={withAsterisk}
    >
      <MonthPicker {...others} />
    </Input.Wrapper>
  )
}

/**
 * Mantine month range picker component for React Form Builder.
 * @param props component properties.
 * @returns month range picker component.
 */
export function MtMonthRangePicker(props: MtMonthPickerProps<'range'>) {
  return <MtMonthPicker {...props} type="range"/>
}

/**
 * Mantine month multiple picker component for React Form Builder.
 * @param props component properties.
 * @returns month multiple picker component.
 */
export function MtMonthMultiplePicker(props: MtMonthPickerProps<'multiple'>) {
  return <MtMonthPicker {...props} type="multiple"/>
}

const monthPickerBaseProps = {
  onChange: onChange,
  size: size,
  label: label,
  description: description,
  error: string,
  numberOfColumns: oneOf(1, 2, 3, 4).default(1),
  columnsToScroll: oneOf(1, 2, 3, 4).default(1),
  firstDayOfWeek: number,
  weekendDays: array,
  locale: string,
  defaultDate: string,
  date: string,
  defaultLevel: oneOfStrict('month', 'year', 'decade'),
  maxLevel: oneOfStrict('month', 'year', 'decade'),
  monthsListFormat: string,
  yearsListFormat: string,
  decadeLabelFormat: string,
  yearLabelFormat: string,
  monthLabelFormat: string,
  minDate: string,
  maxDate: string,
  withAsterisk: required,
}

export const mtMonthPicker = define(MtMonthPicker, 'MtMonthPicker')
  .category(datesCategory)
  // TODO FE-1803 add support for level, onLevelChange, onMonthSelect, ariaLabels, onDateChange, and getMonthControlProps.
  .props({
    ...monthPickerBaseProps,
    allowDeselect: boolean
      .default(false),
    value: string.valued,
  })

export const mtMonthRangePicker = define(MtMonthRangePicker, 'MtMonthRangePicker')
  .category(datesCategory)
  .props({
    ...monthPickerBaseProps,
    value: array.valued,
    allowSingleDateInRange: boolean
      .default(false),
  })

export const mtMonthMultiplePicker = define(MtMonthMultiplePicker, 'MtMonthMultiplePicker')
  .category(datesCategory)
  .props({
    ...monthPickerBaseProps,
    value: array.valued,
  })
