import type {ColorPickerProps, InputWrapperProps} from '@mantine/core'
import {ColorPicker, Input} from '@mantine/core'
import {array, boolean, define, number, oneOfStrict} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'

/**
 * Props for the MtColorPicker component.
 */
export interface MtColorPickerProps
  extends ColorPickerProps,
    Omit<InputWrapperProps, 'children' | keyof ColorPickerProps> {
}

/**
 * Mantine color picker component for React Form Builder.
 * @param props component properties.
 * @returns color picker component.
 */
export function MtColorPicker(props: MtColorPickerProps) {
  const {
    label,
    description,
    error,
    id,
    required,
    withAsterisk,
    ...others
  } = props

  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error}
      id={id}
      required={required}
      withAsterisk={withAsterisk}
    >
      <ColorPicker {...others} />
    </Input.Wrapper>
  )
}

export const mtColorPicker = define(MtColorPicker, 'MtColorPicker')
  .category(inputsCategory)
  .props({
    ...baseInputProps,
    format: oneOfStrict('hex', 'hexa', 'rgb', 'rgba', 'hsl', 'hsla'),
    swatches: array.ofString.default([]),
    swatchesPerRow: number,
    withPicker: boolean.default(true),
    fullWidth: boolean.default(false),
  })
