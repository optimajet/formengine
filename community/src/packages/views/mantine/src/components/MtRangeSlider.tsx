import type {InputWrapperProps, RangeSliderProps} from '@mantine/core'
import {Input, RangeSlider} from '@mantine/core'
import {array, boolean, define, event, number, required, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {mantineColor} from './internal/mantineColor'

/**
 * Props for the MtRangeSlider component.
 */
export interface MtRangeSliderProps
  extends Omit<RangeSliderProps, 'size' | 'label'>,
    Omit<InputWrapperProps, 'children' | Exclude<keyof RangeSliderProps, 'size' | 'label'>> {
}

/**
 * Mantine range slider component for React Form Builder.
 * @param props component properties.
 * @returns range slider component.
 */
export function MtRangeSliderComponent(props: MtRangeSliderProps) {
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
    maxRange,
    step,
    precision,
    inverted,
    labelAlwaysOn,
    pushOnOverlap,
    showLabelOnHover,
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
      <RangeSlider
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        maxRange={maxRange}
        step={step}
        precision={precision}
        inverted={inverted}
        labelAlwaysOn={labelAlwaysOn}
        pushOnOverlap={pushOnOverlap}
        showLabelOnHover={showLabelOnHover}
        size={size}
        {...others}
      />
    </Input.Wrapper>
  )
}

export const mtRangeSlider = define(MtRangeSliderComponent, 'MtRangeSlider')
  .category(inputsCategory)
  // TODO FE-1803 add support for marks, label, labelTransitionProps, thumbChildren, thumbFromLabel, thumbToLabel, scale, hiddenInputProps, and thumbProps.
  .props({
    ...baseInputProps,
    value: array.valued.uncontrolledValue([20, 40]),
    min: number.default(0),
    max: number.default(100),
    maxRange: number,
    minRange: number,
    step: number.default(1),
    precision: number,
    domain: array,
    color: mantineColor,
    radius: string,
    thumbSize: number,
    restrictToMarks: boolean.default(false),
    inverted: boolean.default(false),
    labelAlwaysOn: boolean.default(false),
    pushOnOverlap: boolean.default(true),
    showLabelOnHover: boolean.default(true),
    onChangeEnd: event,
    withAsterisk: required,
  })
