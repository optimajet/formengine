import {DateTimePicker} from '@mantine/dates'
import {boolean, define, oneOfStrict, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {datesCategory} from './internal/categories'
import {dropdownType} from './internal/sharedProps'

export const mtDateTimePicker = define(DateTimePicker, 'MtDateTimePicker')
  .category(datesCategory)
  // TODO FE-1803 add support for presets, timePickerProps, submitButtonProps, defaultTimeValue, level, onLevelChange, ariaLabels, onDateChange, renderDay, excludeDate, getDayProps, getMonthControlProps, and getYearControlProps.
  .props({
    ...baseInputProps,
    placeholder: string,
    withSeconds: boolean
      .default(false),
    clearable: boolean
      .default(false),
    valueFormat: string,
    dropdownType: dropdownType,
    defaultDate: string,
    date: string,
    defaultLevel: oneOfStrict('month', 'year', 'decade'),
    maxLevel: oneOfStrict('month', 'year', 'decade'),
    monthsListFormat: string,
    yearsListFormat: string,
    decadeLabelFormat: string,
    yearLabelFormat: string,
    monthLabelFormat: string,
  })
