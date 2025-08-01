import {boolean, define, string} from '@react-form-builder/core'
import type {PatternFormatProps} from 'react-number-format'
import {PatternFormat} from 'react-number-format'
import type {InputProps} from 'rsuite'
import {inputProps} from '../commonProperties'
import {Labeled} from './components/Labeled'
import {WrappedInput} from './components/WrappedInput'

interface RsPatternFormatProps extends PatternFormatProps<InputProps> {
  label: string
  onChange: (value: any) => void
}

const RsPatternFormat = ({style, className, label, format, onChange, value, ...props}: RsPatternFormatProps) => {
  let {mask} = props
  if (mask) {
    const maskAsStr = mask === 'string' ? mask : mask.toString()
    if (maskAsStr.match(/\d/g)) {
      console.warn(`Mask ${mask} should not contain numeric character, mask value will be ignored`)
      mask = undefined
    }
  }

  return <Labeled label={label} style={style} className={className} passAriaToChildren={true}>
    <PatternFormat customInput={WrappedInput} format={format ?? ''} {...props} mask={mask}
                   onValueChange={values => onChange?.(values.formattedValue)}
                   value={value ?? ''}/>
  </Labeled>
}

export const rsPatternFormat = define(RsPatternFormat, 'RsPatternFormat')
  .name('Pattern format')
  .props({
    label: string.default('Formatted input'),
    value: string.valued,
    ...inputProps,
    format: string,
    mask: string,
    patternChar: string,
    allowEmptyFormatting: boolean.default(false)
  })
