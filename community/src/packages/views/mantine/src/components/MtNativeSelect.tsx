import {NativeSelect} from '@mantine/core'
import {array, define, toLabeledValues} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {inputSectionProps} from './internal/inputSectionProps'
import {valueEventHandlers} from './internal/valueEventHandlers'

export const mtNativeSelect = define(NativeSelect, 'MtNativeSelect')
  .category(inputsCategory)
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    data: array
      .default(toLabeledValues(['Option 1', 'Option 2', 'Option 3'])),
  })
  .overrideEventHandlers(valueEventHandlers)
