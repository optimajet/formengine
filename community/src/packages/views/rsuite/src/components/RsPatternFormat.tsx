import {boolean, define, string} from '@react-form-builder/core'
import {useCallback} from 'react'
import type {PatternFormatProps} from 'react-number-format'
import {PatternFormat} from 'react-number-format'
import type {InputProps} from 'rsuite'
import {inputProps} from '../commonProperties'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'
import {WrappedInput} from './components/WrappedInput'

/**
 * Props for the RsPatternFormat component.
 */
export interface RsPatternFormatProps extends PatternFormatProps<InputProps> {
  /**
   * The label for the pattern format input.
   */
  label: string
  /**
   * The callback when value changes.
   */
  onChange: (value: any) => void
  /**
   * The htmlSize attribute defines the width of the &laquo;input> element.
   */
  htmlSize?: number
}

/**
 * Pattern format input component with label support.
 * @param props the component props.
 * @param props.style the CSS styles.
 * @param props.className the CSS class name.
 * @param props.label the label for the pattern format input.
 * @param props.format the format pattern.
 * @param props.onChange the callback when value changes.
 * @param props.value the value of the input.
 * @param props.props the additional pattern format props.
 * @returns the React element.
 */
const RsPatternFormat = ({style, className, label, format, onChange, value, ...props}: RsPatternFormatProps) => {
  let {mask} = props

  if (mask) {
    const maskAsStr = mask === 'string' ? mask : mask.toString()
    if (maskAsStr.match(/\d/g)) {
      console.warn(`Mask ${mask} should not contain numeric character, mask value will be ignored`)
      mask = undefined
    }
  }

  const handleValueChange = useCallback((values: any) => onChange?.(values.formattedValue), [onChange])

  return <Labeled label={label} style={style} className={className} passAriaToChildren={true}>
    <PatternFormat customInput={WrappedInput} format={format ?? ''} {...props} mask={mask}
                   onValueChange={handleValueChange}
                   value={value ?? ''}/>
  </Labeled>
}

export const rsPatternFormat = define(RsPatternFormat, 'RsPatternFormat')
  .name('Pattern format')
  .category(fieldsCategory)
  .props({
    label: string.default('Formatted input'),
    value: string.valued,
    ...inputProps,
    format: string,
    mask: string,
    patternChar: string,
    allowEmptyFormatting: boolean.default(false)
  })
