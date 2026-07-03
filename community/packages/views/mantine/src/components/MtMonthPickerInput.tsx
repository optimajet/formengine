import type {MonthPickerInputProps} from '@mantine/dates'
import {MonthPickerInput} from '@mantine/dates'
import {array, boolean, date, define, number, oneOf, oneOfStrict, required, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {datesCategory} from './internal/categories'
import {description, dropdownType, label, size} from './internal/sharedProps'

function MonthRangePickerInput(props: MonthPickerInputProps<'range'>) {
  return <MonthPickerInput {...props} type="range"/>
}

function MonthMultiplePickerInput(props: MonthPickerInputProps<'multiple'>) {
  return <MonthPickerInput {...props} type="multiple"/>
}

const monthPickerInputBaseProps = {
  size: size,
  label: label,
  description: description,
  disabled: boolean.default(false),
  placeholder: string,
  onChange: baseInputProps.onChange,
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
  dropdownType: dropdownType,
  clearable: boolean
    .default(false),
  valueFormat: string,
  withAsterisk: required,
}

export const mtMonthPickerInput = define(MonthPickerInput, 'MtMonthPickerInput')
  .category(datesCategory)
  // TODO FE-1803 add support for valueFormatter, labelSeparator, closeOnChange, sortDates, level, onLevelChange, onMonthSelect, ariaLabels, onDateChange, and getMonthControlProps.
  .props({
    ...monthPickerInputBaseProps,
    allowDeselect: boolean
      .default(false),
    value: date.valued,
  })

export const mtMonthRangePickerInput = define(MonthRangePickerInput, 'MtMonthRangePickerInput')
  .category(datesCategory)
  .props({
    ...monthPickerInputBaseProps,
    allowSingleDateInRange: boolean
      .default(false),
    value: array.valued,
  })

export const mtMonthMultiplePickerInput = define(MonthMultiplePickerInput, 'MtMonthMultiplePickerInput')
  .category(datesCategory)
  .props({
    ...monthPickerInputBaseProps,
    value: array.valued,
  })
