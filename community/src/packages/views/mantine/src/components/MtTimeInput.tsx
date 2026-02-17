import {TimeInput} from '@mantine/dates'
import {boolean, define, required, string, time} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {datesCategory} from './internal/categories'
import {inputFocusProps, inputSectionProps} from './internal/inputSectionProps'
import {valueEventHandlers} from './internal/valueEventHandlers'

export const mtTimeInput = define(TimeInput, 'MtTimeInput')
  .category(datesCategory)
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    ...inputFocusProps,
    placeholder: string,
    value: time.valued.uncontrolledValue(''),
    withSeconds: boolean.default(false),
    withAsterisk: required,
  })
  .overrideEventHandlers(valueEventHandlers)
