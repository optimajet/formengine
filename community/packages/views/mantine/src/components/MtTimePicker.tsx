import {TimePicker} from '@mantine/dates'
import {boolean, define, number, oneOf, required, string, time} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {datesCategory} from './internal/categories'
import {inputFocusProps, inputSectionProps} from './internal/inputSectionProps'

export const mtTimePicker = define(TimePicker, 'MtTimePicker')
  .category(datesCategory)
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    ...inputFocusProps,
    withSeconds: boolean.default(false),
    withDropdown: boolean.default(true),
    clearable: boolean.default(false),
    format: oneOf('12h', '24h').default('24h'),
    max: string,
    min: string,
    hoursStep: number,
    minutesStep: number,
    secondsStep: number,
    name: string,
    form: string,
    reverseTimeControlsList: boolean.default(false),
    value: time.valued.uncontrolledValue(''),
    withAsterisk: required,
  })
