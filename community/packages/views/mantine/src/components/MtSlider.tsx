import type {InputWrapperProps, SliderProps} from '@mantine/core'
import {Input, Slider} from '@mantine/core'
import {array, boolean, define, event, number, required, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {mantineColor} from './internal/mantineColor'

/**
 * Props for the MtSlider component.
 */
export interface MtSliderProps
  extends Omit<SliderProps, 'size' | 'label'>,
    Omit<InputWrapperProps, 'children' | Exclude<keyof SliderProps, 'size' | 'label'>> {
}

/**
 * Mantine slider component for React Form Builder.
 * @param props component properties.
 * @returns slider component.
 */
export function MtSliderComponent(props: MtSliderProps) {
  const {
    label,
    description,
    error,
    required,
    withAsterisk,
    value,
    disabled,
    min,
    max,
    step,
    size,
    ...others
  } = props

  return (
    <Input.Wrapper
      label={label}
      description={description}
      error={error}
      required={required}
      withAsterisk={withAsterisk}
      size={size}
    >
      <Slider
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        size={size}
        {...others}
      />
    </Input.Wrapper>
  )
}

export const mtSlider = define(MtSliderComponent, 'MtSlider')
  .category(inputsCategory)
  // TODO FE-1803 add support for marks, label, labelTransitionProps, thumbChildren, thumbLabel, scale, hiddenInputProps, and thumbProps.
  .props({
    ...baseInputProps,
    value: number.valued.uncontrolledValue(50),
    min: number.default(0),
    max: number.default(100),
    precision: number,
    step: number.default(1),
    domain: array,
    color: mantineColor,
    radius: string,
    labelAlwaysOn: boolean.default(false),
    showLabelOnHover: boolean.default(true),
    thumbSize: number,
    restrictToMarks: boolean.default(false),
    inverted: boolean.default(false),
    onChangeEnd: event,
    withAsterisk: required,
  })
