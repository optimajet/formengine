import {ColorInput} from '@mantine/core'
import {array, boolean, define, event, number, oneOf, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'

export const mtColorInput = define(ColorInput, 'MtColorInput')
  .category(inputsCategory)
  // TODO FE-1803 add support for eyeDropperIcon.
  .props({
    ...baseInputProps,
    placeholder: string,
    format: oneOf('hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla'),
    swatches: array.ofString.default([]),
    swatchesPerRow: number,
    withPicker: boolean.default(true),
    withEyeDropper: boolean.default(false),
    closeOnColorSwatchClick: boolean.default(true),
    disallowInput: boolean.default(false),
    fixOnBlur: boolean.default(false),
    onChangeEnd: event,
  })
