import type {InputWrapperProps} from '@mantine/core'
import {Input} from '@mantine/core'
import type {DatePickerProps, DatePickerType} from '@mantine/dates'
import {DatePicker} from '@mantine/dates'
import {array, boolean, date, define, number, oneOf, oneOfStrict, required, string} from '@react-form-builder/core'
import {datesCategory} from './internal/categories'
import {description, label, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtDatePicker component.
 */
export interface MtDatePickerProps<Type extends DatePickerType = 'default'>
  extends DatePickerProps<Type>,
    Omit<InputWrapperProps, 'children' | keyof DatePickerProps<Type>> {
}

/**
 * Mantine date picker component for React Form Builder.
 * @param props component properties.
 * @returns date picker component.
 */
export function MtDatePicker<Type extends DatePickerType = 'default'>(props: MtDatePickerProps<Type>) {
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
      <DatePicker {...others} />
    </Input.Wrapper>
  )
}

/**
 * Mantine date range picker component for React Form Builder.
 * @param props component properties.
 * @returns date range picker component.
 */
export function MtDateRangePicker(props: MtDatePickerProps<'range'>) {
  return <MtDatePicker {...props} type="range"/>
}

/**
 * Mantine date multiple picker component for React Form Builder.
 * @param props component properties.
 * @returns date multiple picker component.
 */
export function MtDateMultiplePicker(props: MtDatePickerProps<'multiple'>) {
  return <MtDatePicker {...props} type="multiple"/>
}

const datePickerBaseProps = {
  onChange: onChange,
  size: size,
  label: label,
  description: description,
  error: string,
  numberOfColumns: oneOf(1, 2, 3).default(1),
  columnsToScroll: oneOf(1, 2, 3).default(1),
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
  withWeekNumbers: boolean.default(false),
  hideOutsideDates: boolean.default(false),
  hideWeekdays: boolean.default(false),
  highlightToday: boolean.default(true),
  minDate: string,
  maxDate: string,
  withAsterisk: required,
}

export const mtDatePicker = define(MtDatePicker, 'MtDatePicker')
  .category(datesCategory)
  // TODO FE-1803 add support for presets, level, onLevelChange, ariaLabels, onDateChange, renderDay, excludeDate, getDayProps, getMonthControlProps, getYearControlProps, and headerControlsOrder.
  .props({
    ...datePickerBaseProps,
    allowDeselect: boolean.default(false),
    value: date.valued,
  })

export const mtDateRangePicker = define(MtDateRangePicker, 'MtDateRangePicker')
  .category(datesCategory)
  .props({
    ...datePickerBaseProps,
    value: array.valued,
    allowSingleDateInRange: boolean
      .default(false),
  })

export const mtDateMultiplePicker = define(MtDateMultiplePicker, 'MtDateMultiplePicker')
  .category(datesCategory)
  .props({
    ...datePickerBaseProps,
    value: array.valued,
  })
