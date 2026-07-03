import type {YearPickerInputProps} from '@mantine/dates'
import {YearPickerInput} from '@mantine/dates'
import {array, boolean, date, define, number, oneOf, oneOfStrict, required, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {datesCategory} from './internal/categories'
import {description, dropdownType, label, size} from './internal/sharedProps'

function YearRangePickerInput(props: YearPickerInputProps<'range'>) {
  return <YearPickerInput {...props} type="range"/>
}

function YearMultiplePickerInput(props: YearPickerInputProps<'multiple'>) {
  return <YearPickerInput {...props} type="multiple"/>
}

const yearPickerInputBaseProps = {
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
  defaultLevel: oneOfStrict('year', 'decade'),
  maxLevel: oneOfStrict('year', 'decade'),
  yearsListFormat: string,
  decadeLabelFormat: string,
  yearLabelFormat: string,
  minDate: string,
  maxDate: string,
  dropdownType: dropdownType,
  clearable: boolean.default(false),
  valueFormat: string,
}

export const mtYearPickerInput = define(YearPickerInput, 'MtYearPickerInput')
  .category(datesCategory)
  // TODO FE-1803 add support for valueFormatter, labelSeparator, closeOnChange, sortDates, level, onLevelChange, onYearSelect, ariaLabels, onDateChange, and getYearControlProps.
  .props({
    ...yearPickerInputBaseProps,
    allowDeselect: boolean.default(false),
    value: date.valued,
    withAsterisk: required,
  })

export const mtYearRangePickerInput = define(YearRangePickerInput, 'MtYearRangePickerInput')
  .category(datesCategory)
  .props({
    ...yearPickerInputBaseProps,
    allowSingleDateInRange: boolean.default(false),
    value: array.valued,
  })

export const mtYearMultiplePickerInput = define(YearMultiplePickerInput, 'MtYearMultiplePickerInput')
  .category(datesCategory)
  .props({
    ...yearPickerInputBaseProps,
    value: array.valued,
  })
