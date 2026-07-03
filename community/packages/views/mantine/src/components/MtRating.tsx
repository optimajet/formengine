import type {InputWrapperProps, RatingProps} from '@mantine/core'
import {Input, Rating} from '@mantine/core'
import {boolean, define, node, number, required} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {mantineColor} from './internal/mantineColor'

/**
 * Props for the MtRating component.
 */
export interface MtRatingProps
  extends Omit<RatingProps, 'size'>,
    Omit<InputWrapperProps, 'children' | Exclude<keyof RatingProps, 'size'>> {
}

/**
 * Mantine rating component for React Form Builder.
 * @param props component properties.
 * @returns rating component.
 */
export function MtRating(props: MtRatingProps) {
  const {
    label,
    description,
    error,
    required,
    withAsterisk,
    value,
    readOnly,
    count,
    size,
    fractions,
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
      <Rating
        value={value}
        readOnly={readOnly}
        count={count}
        size={size}
        fractions={fractions}
        {...others}
      />
    </Input.Wrapper>
  )
}

export const mtRating = define(MtRating, 'MtRating')
  .category(inputsCategory)
  .props({
    ...baseInputProps,
    value: number.valued.uncontrolledValue(0),
    count: number.default(5),
    fractions: number.default(1),
    highlightSelectedOnly: boolean.default(false),
    color: mantineColor,
    emptySymbol: node,
    fullSymbol: node,
    withAsterisk: required,
  })
