import type {DatePickerInputProps} from '@mantine/dates'
import {DatePickerInput} from '@mantine/dates'
import {array, boolean, date, define, number, oneOf, oneOfStrict, required, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {datesCategory} from './internal/categories'
import {description, dropdownType, label, size} from './internal/sharedProps'

function DateRangePicker(props: DatePickerInputProps<'range'>) {
  return <DatePickerInput {...props} type="range"/>
}

function DateMultiplePicker(props: DatePickerInputProps<'multiple'>) {
  return <DatePickerInput {...props} type="multiple"/>
}

const datePickerInputBaseProps = {
  size: size,
  label: label,
  description: description,
  disabled: boolean.default(false),
  placeholder: string,
  onChange: baseInputProps.onChange,
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
  dropdownType: dropdownType,
  clearable: boolean.default(false),
  valueFormat: string,
  withAsterisk: required,
}

export const mtDatePickerInput = define(DatePickerInput, 'MtDatePickerInput')
  .category(datesCategory)
  // TODO FE-1803 add support for presets, valueFormatter, labelSeparator, closeOnChange, sortDates, level, onLevelChange, ariaLabels, onDateChange, renderDay, excludeDate, getDayProps, getMonthControlProps, getYearControlProps, and headerControlsOrder.
  .props({
    ...datePickerInputBaseProps,
    allowDeselect: boolean.default(false),
    value: date.valued,
  })

export const mtDateRangePickerInput = define(DateRangePicker, 'MtDateRangePickerInput')
  .category(datesCategory)
  .props({
    ...datePickerInputBaseProps,
    allowSingleDateInRange: boolean.default(false),
    value: array.valued,
  })

export const mtDateMultiplePickerInput = define(DateMultiplePicker, 'MtDateMultiplePickerInput')
  .category(datesCategory)
  .props({
    ...datePickerInputBaseProps,
    value: array.valued,
  })
