import {CircularProgress} from '@mui/material'
import type {DatePickerProps} from '@mui/x-date-pickers'
import {DatePicker} from '@mui/x-date-pickers'
import {boolean, date, define, event, number, oneOf, oneOfStrict, readOnly, someOf, string, toLabeledValues} from '@react-form-builder/core'
import dayjs from 'dayjs'
import {useCallback, useMemo} from 'react'
import {inputsCategory} from './categories'
import {formControlProperties} from './internal/FormControl/defineFormControl'
import {useFormControlProps} from './internal/FormControl/FormControl'
import type {MuiControlProps} from './internal/FormControl/types'

const viewAnnotation = oneOf().withEditorProps({
  creatable: false,
  calculateEditorProps: (props: Record<string, any>) => ({
    data: toLabeledValues(props.views as string[] ?? [])
  })
})

/**
 * Converts user-friendly date format tokens to Day.js format tokens.
 * @param userFormat the user-friendly date format string.
 * @returns the formatted string.
 */
function convertFormat(userFormat = 'yyyy-MM-dd'): string {
  return userFormat
    .replace(/yyyy/g, 'YYYY')
    .replace(/yy/g, 'YY')
    .replace(/MM/g, 'MM')
    .replace(/M/g, 'M')
    .replace(/dd/g, 'DD')
    .replace(/d/g, 'D')
    .replace(/HH/g, 'HH')
    .replace(/H/g, 'H')
    .replace(/hh/g, 'hh')
    .replace(/h/g, 'h')
    .replace(/mm/g, 'mm')
    .replace(/m/g, 'm')
    .replace(/ss/g, 'ss')
    .replace(/s/g, 's')
    .replace(/a/g, 'A')
    .replace(/A/g, 'A')
}

/**
 * Props for the MuiDatePicker component.
 */
export interface MuiDatePickerProps extends Omit<DatePickerProps<any, any>, 'reduceAnimations'>,
  Pick<MuiControlProps, 'error' | 'helperText' | 'readOnly' | 'required'> {
}

type ChangeHandler = NonNullable<MuiDatePickerProps['onChange']>

const renderLoading = () => <CircularProgress/>

const useDayJsDate = (value: any) => {
  return useMemo(() => value ? dayjs(value) : value, [value])
}

const RawDatePicker = ({onChange, value, defaultValue, ...props}: MuiDatePickerProps) => {
  const [fieldProps, componentProps] = useFormControlProps(props)
  const {onChange: _, label, shrinkLabel = 'auto', format, views, referenceDate, minDate, maxDate, ...filteredProps} = componentProps

  const slotProps = useMemo(() => ({textField: fieldProps}), [fieldProps])
  const convertedValue = useDayJsDate(value)
  const convertedDefaultValue = useDayJsDate(defaultValue)
  const convertedReferenceValue = useDayJsDate(referenceDate)
  const convertedMinDate = useDayJsDate(minDate)
  const convertedMaxDate = useDayJsDate(maxDate)
  const convertedFormat = useMemo(() => convertFormat(format), [format])
  const handleChange = useCallback<ChangeHandler>((newValue, ...args) => {
    onChange?.(newValue?.toDate(), ...args)
  }, [onChange])

  return (
    <DatePicker
      value={convertedValue}
      defaultValue={convertedDefaultValue}
      referenceDate={convertedReferenceValue}
      minDate={convertedMinDate}
      maxDate={convertedMaxDate}
      onChange={handleChange}
      slotProps={slotProps}
      format={convertedFormat}
      renderLoading={renderLoading}
      views={views?.length ? views : undefined}
      {...filteredProps}
    />
  )
}

const MuiDatePicker = ({open, openTo, view, ...props}: MuiDatePickerProps) => {
  const activeView = useMemo(() => {
    const rawView = open ? openTo : view
    return rawView && props.views?.includes(rawView) ? rawView : undefined
  }, [open, openTo, props.views, view])

  return open
    ? <RawDatePicker key={`${activeView}-expanded-date-picker`} {...props} open={open} openTo={activeView}/>
    : <RawDatePicker key={`${activeView}-collapsed-date-picker`} {...props} view={activeView} openTo={undefined}/>
}

export const muiDatePicker = define(MuiDatePicker, 'MuiDatePicker')
  .icon('DatePicker')
  .category(inputsCategory)
  .props({
    value: date.valued.uncontrolledValue(null),
    format: string.withEditorProps({placeholder: 'yyyy-MM-dd'}),
    ...formControlProperties,
    readOnly: readOnly,
    autoFocus: boolean,
    closeOnSelect: boolean.default(true),
    defaultValue: date,
    desktopModeMediaQuery: string,
    disableFuture: boolean,
    disableHighlightToday: boolean,
    disableOpenPicker: boolean,
    disablePast: boolean,
    displayWeekNumber: boolean,
    fixedWeekNumber: number,
    formatDensity: oneOfStrict('dense', 'spacious').default('dense'),
    loading: boolean,
    minDate: date,
    maxDate: date,
    monthsPerRow: number,
    name: string,
    onAccept: event,
    onClose: event,
    onError: event,
    onMonthChange: event,
    onOpen: event,
    onSelectedSectionsChange: event,
    onViewChange: event,
    onYearChange: event,
    open: boolean,
    openTo: viewAnnotation,
    referenceDate: date,
    showDaysOutsideCurrentMonth: boolean,
    view: viewAnnotation,
    views: someOf('day', 'month', 'year')
      // .default(['day', 'month', 'year'])
      .withEditorProps({creatable: false}),
    yearsOrder: oneOfStrict('asc', 'desc').default('asc'),
    yearsPerRow: number,
  })
