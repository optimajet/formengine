import {PasswordInput} from '@mantine/core'
import {boolean, define, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {inputFocusProps, inputSectionProps} from './internal/inputSectionProps'
import {valueEventHandlers} from './internal/valueEventHandlers'

export const mtPasswordInput = define(PasswordInput, 'MtPasswordInput')
  .category(inputsCategory)
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    ...inputFocusProps,
    placeholder: string,
    defaultVisible: boolean,
  })
  .overrideEventHandlers(valueEventHandlers)
