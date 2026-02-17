import type {InputWrapperProps, SegmentedControlProps} from '@mantine/core'
import {Input, SegmentedControl} from '@mantine/core'
import {array, boolean, define, number, oneOfStrict, required, string, toLabeledValues} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {mantineColor} from './internal/mantineColor'

/**
 * Props for the MtSegmentedControl component.
 */
export interface MtSegmentedControlProps
  extends Omit<SegmentedControlProps, 'size' | 'label'>,
    Omit<InputWrapperProps, 'children' | Exclude<keyof SegmentedControlProps, 'size' | 'label'>> {
}

/**
 * Mantine segmented control component for React Form Builder.
 * @param props component properties.
 * @returns segmented control component.
 */
export function MtSegmentedControl(props: MtSegmentedControlProps) {
  const {
    label,
    description,
    error,
    required,
    withAsterisk,
    value,
    data,
    disabled,
    size,
    onChange,
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
      <div>
        <SegmentedControl
          value={value}
          data={data}
          disabled={disabled}
          size={size}
          onChange={onChange}
          {...others}
        />
      </div>
    </Input.Wrapper>
  )
}

export const mtSegmentedControl = define(MtSegmentedControl, 'MtSegmentedControl')
  .category(inputsCategory)
  // TODO FE-1803 add support for data item disabled/label ReactNode.
  .props({
    ...baseInputProps,
    value: string.valued,
    data: array
      .default(toLabeledValues(['Option 1', 'Option 2', 'Option 3'])),
    color: mantineColor,
    fullWidth: boolean.default(false),
    orientation: oneOfStrict('horizontal', 'vertical')
      .default('horizontal'),
    radius: string,
    readOnly: boolean.default(false),
    withItemsBorders: boolean.default(true),
    transitionDuration: number,
    transitionTimingFunction: string,
    withAsterisk: required,
  })
