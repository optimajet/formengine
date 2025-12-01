import {boolean, date, define, disabled, event, number, oneOf, string, useComponentData} from '@react-form-builder/core'
import {useEffect, useMemo} from 'react'
import type {DatePickerProps} from 'rsuite'
import {DatePicker} from 'rsuite'
import {placement, readOnly, size} from '../commonProperties'
import {formatValidator, toSafeFormat} from '../dateTimeUtils'
import {fieldsCategory} from './categories'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'
import {Labeled} from './internal/Labeled'

/**
 * Props for the RsDatePicker component.
 */
export interface RsDatePickerProps extends DatePickerProps {
  /**
   * Label for the date picker.
   */
  label: string
  /**
   * Called after the value has been changed.
   * @param value the value.
   */
  onChange?: (value: Date | null) => void
  /**
   * @deprecated
   */
  inline?: boolean
}

/**
 * Returns the date converted to Date format.
 * @param value the date value in string or Date format.
 * @returns the date converted to Date format.
 */
const parseDateValue = (value: any) => {
  if (typeof value === 'string') {
    const parsedDate = new Date(value)
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate
    }
    console.error('Invalid date string:', value)
    return null
  }
  return value
}

/**
 * Date picker component with label support.
 * @param props the component props.
 * @param props.label the label for the date picker.
 * @param props.value the value of the date picker.
 * @param props.className the CSS class name.
 * @param props.format the format of the date.
 * @param props.defaultValue the default value of the date picker.
 * @param props.props the additional date picker props.
 * @returns the React element.
 */
const RsDatePicker = ({label, value, className, format, defaultValue, ...props}: RsDatePickerProps) => {
  const componentData = useComponentData()
  const safeFormat = useMemo(() => toSafeFormat(format), [format])
  const onClean = useTouchOnEvent(props, 'onClean')
  const parsedValue = useMemo(() => parseDateValue(value), [value])

  useEffect(() => {
    if (typeof (value as unknown) === 'string') {
      const parsed = parseDateValue(value)
      if (parsed instanceof Date) {
        componentData.field?.setValue(parsed)
      }
    }
  }, [value, componentData])

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <DatePicker {...props} value={parsedValue ?? defaultValue ?? null} format={safeFormat} onClean={onClean}/>
    </Labeled>
  )
}

export const rsDatePicker = define(RsDatePicker, 'RsDatePicker')
  .name('DatePicker')
  .category(fieldsCategory)
  .props({
    label: string.default('Date'),
    appearance: oneOf('default', 'subtle').withEditorProps({creatable: false}),
    calendarDefaultDate: date,
    cleanable: boolean.default(false),
    defaultOpen: boolean.default(false),
    defaultValue: date,
    disabled: disabled.default(false),
    readOnly,
    editable: boolean.default(true),
    format: string.validated(formatValidator, {
      code: 'INVALID_DATE_FORMAT',
      message: 'The provided date format is invalid'
    }).withEditorProps({placeholder: 'yyyy-MM-dd'}),
    isoWeek: boolean.default(false),
    limitEndYear: number,
    limitStartYear: number,
    oneTap: boolean,
    onChange: event,
    onChangeCalendarDate: event,
    onClean: event,
    onClose: event,
    onEnter: event,
    onEntered: event,
    onEntering: event,
    onExit: event,
    onExited: event,
    onExiting: event,
    onNextMonth: event,
    onOk: event,
    onOpen: event,
    onPrevMonth: event,
    onSelect: event,
    onToggleMonthDropdown: event,
    onToggleTimeDropdown: event,
    open: boolean.default(undefined),
    placeholder: string,
    placement: placement,
    preventOverflow: boolean.default(false),
    showMeridiem: boolean.default(false),
    showWeekNumbers: boolean.default(false),
    size: size,
    value: date.valued
  })
