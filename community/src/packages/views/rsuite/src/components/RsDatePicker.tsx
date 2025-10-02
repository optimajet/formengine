import {boolean, date, define, disabled, event, number, oneOf, string, useComponentData} from '@react-form-builder/core'
import {useEffect, useMemo} from 'react'
import type {DatePickerProps} from 'rsuite'
import {DatePicker} from 'rsuite'
import {placement, readOnly, size} from '../commonProperties'
import {formatValidator, toSafeFormat} from '../dateTimeUtils'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

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
    appearance: oneOf('default', 'subtle').hinted('Set picker appearance')
      .withEditorProps({creatable: false}),
    calendarDefaultDate: date.hinted('Calendar panel default presentation date and time'),
    cleanable: boolean.hinted('Whether the selected value can be cleared').default(false),
    defaultOpen: boolean.hinted('Default value of open property').default(false),
    defaultValue: date.hinted('Default value'),
    disabled: disabled.hinted('Whether disabled the component').default(false),
    readOnly,
    editable: boolean.hinted('Rendered as an input, the date can be entered via the keyboard').default(true),
    format: string.validated(formatValidator, {
      code: 'INVALID_DATE_FORMAT',
      message: 'The provided date format is invalid'
    }).hinted('Format of the date when rendered in the input')
      .withEditorProps({placeholder: 'yyyy-MM-dd'}),
    isoWeek: boolean.hinted('ISO 8601 standard, each calendar week begins on Monday and Sunday on the seventh day').default(false),
    limitEndYear: number.hinted('Set the upper limit of the available year relative to the current selection date'),
    limitStartYear: number.hinted('Set the lower limit of the available year relative to the current selection date'),
    oneTap: boolean,
    onChange: event.hinted('Callback fired when value changed'),
    onChangeCalendarDate: event.hinted('Callback function that changes the calendar date'),
    onClean: event.hinted('Callback fired when value clean'),
    onClose: event.hinted('Callback fired when close component'),
    onEnter: event.hinted('Callback fired before the overlay transitions in'),
    onEntered: event.hinted('Callback fired after the overlay finishes transitioning in'),
    onEntering: event.hinted('Callback fired as the overlay begins to transition in'),
    onExit: event.hinted('Callback fired right before the overlay transitions out'),
    onExited: event.hinted('Callback fired after the overlay finishes transitioning out'),
    onExiting: event.hinted('Callback fired as the overlay begins to transition out'),
    onNextMonth: event.hinted('Switch to the callback function for the next Month'),
    onOk: event.hinted('Click the OK callback function'),
    onOpen: event.hinted('Callback fired when open component'),
    onPrevMonth: event.hinted('Switch to the callback function for the previous Month'),
    onSelect: event.hinted('Callback fired when date or time is selected'),
    onToggleMonthDropdown: event.hinted('Callback function that switches to the month view'),
    onToggleTimeDropdown: event.hinted('Callback function that switches to the time view'),
    open: boolean.hinted('Whether open the component').default(undefined),
    placeholder: string.hinted('Placeholder'),
    placement: placement.hinted('The placement of component'),
    preventOverflow: boolean.hinted('Prevent floating element overflow').default(false),
    showMeridiem: boolean.hinted('Display hours in 12 format').default(false),
    showWeekNumbers: boolean.hinted('Whether to show week numbers').default(false),
    size: size.hinted('A picker size'),
    value: date.valued.hinted('Value (Controlled)')
  })
