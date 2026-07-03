import {JsonInput} from '@mantine/core'
import {boolean, define, number, required, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {inputSectionProps} from './internal/inputSectionProps'
import {minRows} from './internal/sharedProps'

export const mtJsonInput = define(JsonInput, 'MtJsonInput')
  .category(inputsCategory)
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    placeholder: string,
    value: string.valued.uncontrolledValue('{}'),
    minRows: minRows,
    maxRows: number,
    autosize: boolean.default(false),
    formatOnBlur: boolean.default(false),
    validationError: string,
    withAsterisk: required,
  })
