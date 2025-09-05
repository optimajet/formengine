import {array, boolean, define, isString, number, oneOf, string} from '@react-form-builder/core'
import {useCallback} from 'react'
import type {NumericFormatProps} from 'react-number-format'
import {NumericFormat} from 'react-number-format'
import type {NumberFormatValues} from 'react-number-format/types/types'
import type {InputProps} from 'rsuite'
import {inputProps, nonNegNumber} from '../commonProperties'
import {Labeled} from './components/Labeled'
import {WrappedInput} from './components/WrappedInput'

interface RsNumberFormatProps extends NumericFormatProps<InputProps> {
  label: string
  onChange: (value: any) => void
}

function getSeparators(props: { thousandSeparator?: boolean | string, decimalSeparator?: string }) {
  let {decimalSeparator = '.'} = props
  let {thousandSeparator} = props
  if (thousandSeparator === true) thousandSeparator = ','

  if (thousandSeparator === decimalSeparator) {
    console.warn(`
        Decimal separator can't be same as thousand separator.
        thousandSeparator: ${thousandSeparator} (thousandSeparator = {true} is same as thousandSeparator = ",")
        decimalSeparator: ${decimalSeparator} (default value for decimalSeparator is .)
     `)
    thousandSeparator = undefined
    decimalSeparator = '.'
  }

  if (thousandSeparator && isString(thousandSeparator)) {
    if (thousandSeparator.indexOf('-') >= 0) {
      console.warn(`Thousand separator can't contain '-' character`)
      thousandSeparator = undefined
    } else if (thousandSeparator.match(/\d/g)) {
      console.warn(`Thousand separator should not contain numeric character`)
      thousandSeparator = undefined
    }
  }

  if (decimalSeparator.match(/\d/g)) {
    console.warn(`Decimal separator should not contain numeric character`)
    decimalSeparator = '.'
  }

  return {decimalSeparator, thousandSeparator}
}

const RsNumberFormat = ({style, className, label, onChange, value, ...props}: RsNumberFormatProps) => {
  const {decimalSeparator, thousandSeparator} = getSeparators(props)

  value = value ?? ''
  if (typeof value === 'number' && !Number.isFinite(value)) {
    value = ''
  }

  const onValueChange = useCallback((values: NumberFormatValues) => onChange?.(values.value), [onChange])

  return <Labeled label={label} style={style} className={className} passAriaToChildren={true}>
    {/* TODO FE-1066 */}
    {/* @ts-ignore FE-1066 */}
    <NumericFormat customInput={WrappedInput}
                   {...props}
                   decimalSeparator={decimalSeparator}
                   thousandSeparator={thousandSeparator}
                   onValueChange={onValueChange}
                   value={value}/>
  </Labeled>
}

export const rsNumberFormat = define(RsNumberFormat, 'RsNumberFormat')
  .name('Number format')
  .props({
    label: string.default('Number input'),
    value: number.valued,
    ...inputProps,
    allowedDecimalSeparators: array.ofString,
    allowLeadingZeros: boolean.default(false),
    allowNegative: boolean.default(true),
    decimalScale: nonNegNumber,
    decimalSeparator: string,
    fixedDecimalScale: boolean.default(false),
    prefix: string,
    suffix: string,
    thousandsGroupStyle: oneOf('thousand', 'lakh', 'wan', 'none').default('none'),
    thousandSeparator: string,
  })
