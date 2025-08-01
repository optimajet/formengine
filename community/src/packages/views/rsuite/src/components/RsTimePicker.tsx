import {boolean, define, disabled, event, string, time, timeFormat} from '@react-form-builder/core'
import {format as formatDate, parse} from 'date-fns'
import type {SyntheticEvent} from 'react'
import {useCallback, useMemo} from 'react'
import type {DatePickerProps} from 'rsuite'
import {DatePicker} from 'rsuite'
import {placement, readOnly, size} from '../commonProperties'
import {formatValidator, toSafeFormat} from '../dateTimeUtils'
import {Labeled} from './components/Labeled'
import {useTouchOnEvent} from './hooks/useTouchOnEvent'

const isValidDate = (value: any) => value instanceof Date && !Number.isNaN(value.getTime())

/**
 * Returns the time converted to Date format.
 * @param value the date value in string or Date format.
 * @param format the time format.
 * @returns the time converted to Date format.
 */
const parseTimeValue = (value: any, format: string) => {
  if (typeof value === 'string') {
    const parsedDate = parse(value, format, new Date())
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate
    }
    console.error('Invalid time string:', value)
    return null
  }
  return value
}

interface RsTimePickerProps extends Omit<DatePickerProps, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string | null, event: SyntheticEvent) => void
  label: string
}

const RsTimePicker = ({open, label, value, className, format, defaultValue, onChange, ...props}: RsTimePickerProps) => {
  const safeFormat = useMemo(() => toSafeFormat(format), [format])
  const onClean = useTouchOnEvent(props, 'onClean')
  const parsedValue = useMemo(() => parseTimeValue(value, timeFormat), [value])
  const parsedDefaultValue = useMemo(() => parseTimeValue(defaultValue, timeFormat), [defaultValue])
  const pickerOpen = useMemo(() => open === true ? true : undefined, [open])

  const handleChange = useCallback((value: Date | null, e: SyntheticEvent) => {
    if (value === null) {
      onChange?.(null, e)
      return
    }
    if (isValidDate(value)) {
      const formatted = formatDate(value, timeFormat)
      onChange?.(formatted, e)
    }
  }, [onChange])

  return (
    <Labeled label={label} className={className} passAriaToChildren={true}>
      <DatePicker {...props} onChange={handleChange} value={parsedValue ?? parsedDefaultValue ?? null}
                  open={pickerOpen} format={safeFormat ?? timeFormat} onClean={onClean} preventOverflow/>
    </Labeled>
  )
}

export const rsTimePicker = define(RsTimePicker, 'RsTimePicker')
  .name('TimePicker')
  .props({
    label: string.default('Time'),
    placeholder: string,
    value: time.valued,
    defaultValue: time,
    format: string
      .validated(formatValidator, {
        code: 'INVALID_TIME_FORMAT',
        message: 'The provided time format is invalid'
      })
      .withEditorProps({placeholder: 'HH:mm'})
      .default('HH:mm'),
    editable: boolean.default(true),
    cleanable: boolean.default(false),
    disabled: disabled.default(false),
    readOnly,
    open: boolean,
    placement: placement,
    size: size,
    onChange: event,
    onClean: event,
    onClose: event,
    onEnter: event,
    onEntered: event,
    onEntering: event,
    onExit: event,
    onExited: event,
    onExiting: event,
    onOk: event,
    onOpen: event,
    onSelect: event
  })
