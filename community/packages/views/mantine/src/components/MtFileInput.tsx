import {FileInput} from '@mantine/core'
import type {ActionEventArgs} from '@react-form-builder/core'
import {array, boolean, define, required, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {inputSectionProps} from './internal/inputSectionProps'
import {onBlur} from './internal/onBlurEventHandler'

export const mtFileInput = define(FileInput, 'MtFileInput')
  .category(inputsCategory)
  // TODO FE-1803 add support for valueComponent.
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    placeholder: string.default('Pick file'),
    accept: string,
    multiple: boolean.default(false),
    clearable: boolean.default(false),
    value: array.valued.uncontrolledValue(null),
    withAsterisk: required,
  })
  .overrideEventHandlers({
    onChange: (e: ActionEventArgs) => {
      const value = e.args[0]
      if (Array.isArray(value)) {
        e.sender.field?.setValue(value)
        return
      }
      if (value instanceof File) {
        e.sender.field?.setValue([value])
        return
      }
    },
    onBlur,
  })
