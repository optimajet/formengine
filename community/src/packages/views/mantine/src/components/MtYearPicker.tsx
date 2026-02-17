import type {InputWrapperProps} from '@mantine/core'
import {Input} from '@mantine/core'
import type {DatePickerType, YearPickerProps} from '@mantine/dates'
import {YearPicker} from '@mantine/dates'
import {array, boolean, define, number, oneOf, oneOfStrict, required, string} from '@react-form-builder/core'
import {datesCategory} from './internal/categories'
import {description, label, onChange, size} from './internal/sharedProps'

/**
 * Props for the MtYearPicker component.
 */
export interface MtYearPickerProps<Type extends DatePickerType = 'default'>
  extends YearPickerProps<Type>,
    Omit<InputWrapperProps, 'children' | keyof YearPickerProps<Type>> {
}

/**
 * Mantine year picker component for React Form Builder.
 * @param props component properties.
 * @returns year picker component.
 */
export function MtYearPicker<Type extends DatePickerType = 'default'>(props: MtYearPickerProps<Type>) {
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
      <YearPicker {...others} />
    </Input.Wrapper>
  )
}

/**
 * Mantine year range picker component for React Form Builder.
 * @param props component properties
 * @returns year range picker component
 */
export function MtYearRangePicker(props: MtYearPickerProps<'range'>) {
  return <MtYearPicker {...props} type="range"/>
}

/**
 * Mantine year multiple picker component for React Form Builder.
 * @param props component properties
 * @returns year multiple picker component
 */
export function MtYearMultiplePicker(props: MtYearPickerProps<'multiple'>) {
  return <MtYearPicker {...props} type="multiple"/>
}

const yearPickerBaseProps = {
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
  defaultLevel: oneOfStrict('year', 'decade'),
  maxLevel: oneOfStrict('year', 'decade'),
  yearsListFormat: string,
  decadeLabelFormat: string,
  yearLabelFormat: string,
  minDate: string,
  maxDate: string,
  withAsterisk: required,
}

export const mtYearPicker = define(MtYearPicker, 'MtYearPicker')
  .category(datesCategory)
  // TODO FE-1803 add support for level, onLevelChange, onYearSelect, ariaLabels, onDateChange, and getYearControlProps.
  .props({
    ...yearPickerBaseProps,
    allowDeselect: boolean.default(false),
    value: string.valued,
  })

export const mtYearRangePicker = define(MtYearRangePicker, 'MtYearRangePicker')
  .category(datesCategory)
  .props({
    ...yearPickerBaseProps,
    value: array.valued,
    allowSingleDateInRange: boolean.default(false),
  })

export const mtYearMultiplePicker = define(MtYearMultiplePicker, 'MtYearMultiplePicker')
  .category(datesCategory)
  .props({
    ...yearPickerBaseProps,
    value: array.valued,
  })
