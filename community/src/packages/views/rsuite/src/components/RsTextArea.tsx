import {define, disabled, event, string} from '@react-form-builder/core'
import type {InputProps} from 'rsuite'
import {Input} from 'rsuite'
import {positiveNumber, readOnly, size} from '../commonProperties'
import {Labeled} from './components/Labeled'

interface RsTextAreaProps extends InputProps {
  label: string
  rows: number
}

const RsTextArea = ({style, className, label, ...props}: RsTextAreaProps) => (
  <Labeled label={label} style={style} className={className}>
    <Input as="textarea" {...props}/>
  </Labeled>
)

export const rsTextArea = define(RsTextArea, 'RsTextArea')
  .name('Text area')
  .props({
    label: string.default('Text area'),
    value: string.default('').valued,
    placeholder: string,
    rows: positiveNumber.default(5),
    size,
    disabled: disabled.hinted('Disabled component').default(false),
    readOnly,
    onChange: event,
    onPressEnter: event
  })
