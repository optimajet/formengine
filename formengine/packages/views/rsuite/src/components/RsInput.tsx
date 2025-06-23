import {boolean, define, oneOf, string} from '@react-form-builder/core'
import {EyeClose as EyeSlashIcon, Visible as EyeIcon} from '@rsuite/icons'
import {useState} from 'react'
import type {InputProps} from 'rsuite'
import {Input, InputGroup} from 'rsuite'
import {inputProps} from '../commonProperties'
import {Labeled} from './components/Labeled'

interface RsInputProps extends InputProps {
  label: string
  passwordMask?: boolean
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'time'
}

const RsInput = ({style, className, label, passwordMask, type, value, ...props}: RsInputProps) => {
  const [visible, setVisible] = useState(false)

  const input = passwordMask
    ? <InputGroup inside>
      <Input type={visible ? 'text' : 'password'} value={value ?? ''} {...props}/>
      <InputGroup.Button onClick={() => setVisible(!visible)}>
        {visible ? <EyeIcon/> : <EyeSlashIcon/>}
      </InputGroup.Button>
    </InputGroup>
    : <Input type={type} value={value ?? ''} {...props}/>

  return <Labeled label={label} style={style} className={className}>
    {input}
  </Labeled>
}
export const rsInput = define(RsInput, 'RsInput')
  .name('Input')
  .props({
    label: string.default('Input').hinted('Input label'),
    ...inputProps,
    type: oneOf('text', 'password', 'email', 'number', 'search', 'tel', 'url', 'time').default('text'),
    value: string.valued.uncontrolledValue(''),
    passwordMask: boolean.default(false)
  })
