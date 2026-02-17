import {Textarea} from '@mantine/core'
import {boolean, define, number, oneOf, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {inputFocusProps, inputSectionProps} from './internal/inputSectionProps'
import {minRows} from './internal/sharedProps'
import {valueEventHandlers} from './internal/valueEventHandlers'

export const mtTextarea = define(Textarea, 'MtTextarea')
  .category(inputsCategory)
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    ...inputFocusProps,
    placeholder: string,
    autosize: boolean.default(false),
    minRows: minRows,
    maxRows: number,
    resize: oneOf('none', 'vertical', 'both').default('none'),
  })
  .overrideEventHandlers(valueEventHandlers)
