import {NumberInput} from '@mantine/core'
import {boolean, define, number, oneOf, oneOfStrict, required, string} from '@react-form-builder/core'
import {baseInputProps} from './internal/baseInputProps'
import {inputsCategory} from './internal/categories'
import {inputFocusProps, inputSectionProps} from './internal/inputSectionProps'

export const mtNumberInput = define(NumberInput, 'MtNumberInput')
  .category(inputsCategory)
  .props({
    ...baseInputProps,
    ...inputSectionProps,
    ...inputFocusProps,
    value: number.valued.uncontrolledValue(0),
    allowDecimal: boolean.default(true),
    allowLeadingZeros: boolean.default(false),
    allowNegative: boolean.default(true),
    clampBehavior: oneOf('none', 'blur', 'strict').default('blur'),
    decimalScale: number,
    decimalSeparator: oneOfStrict('.', ',', ' ')
      .labeled('.', ',', '[space]')
      .default('.'),
    fixedDecimalScale: boolean.default(false),
    hideControls: boolean.default(false),
    prefix: string,
    suffix: string,
    startValue: number,
    thousandSeparator: oneOfStrict(',', '.', ' ', '\'')
      .labeled(',', '.', '[space]', '\''),
    thousandsGroupStyle: oneOf('none', 'thousand', 'lakh', 'wan'),
    trimLeadingZeroesOnBlur: boolean.default(true),
    min: number,
    max: number,
    step: number.default(1),
    withAsterisk: required,
  })
