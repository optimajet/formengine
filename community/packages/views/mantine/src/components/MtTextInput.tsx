import {TextInput} from '@mantine/core'
import {define, oneOf, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {inputFocusProps, inputSectionProps} from './internal/inputSectionProps'
import {valueEventHandlers} from './internal/valueEventHandlers'

export const mtTextInput = define(TextInput, 'MtTextInput')
  .category(inputsCategory)
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    ...inputFocusProps,
    placeholder: string,
    type: oneOf('text', 'password', 'email', 'number', 'search', 'tel', 'url', 'time')
      .default('text'),
  })
  .overrideEventHandlers(valueEventHandlers)
