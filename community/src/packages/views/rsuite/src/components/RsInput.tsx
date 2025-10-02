import {boolean, define, oneOf, string, useAriaAttributes, useComponentData} from '@react-form-builder/core'
import {EyeClose as EyeSlashIcon, Visible as EyeIcon} from '@rsuite/icons'
import {useCallback, useState} from 'react'
import type {InputProps} from 'rsuite'
import {Input, InputGroup} from 'rsuite'
import {inputProps} from '../commonProperties'
import {fieldsCategory} from './categories'
import {Labeled} from './components/Labeled'

/**
 * Props for the RsInput component.
 */
export interface RsInputProps extends InputProps {
  /**
   * The label for the input.
   */
  label: string
  /**
   * Whether to show password mask.
   */
  passwordMask?: boolean,
  /**
   * The aria label for the show password button.
   */
  showPasswordAriaLabel: string,
  /**
   * The type of the input.
   */
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'time'
  /**
   * The htmlSize attribute defines the width of the &laquo;input> element.
   */
  htmlSize?: number
}

/**
 * Input component with label and password mask support.
 * @param props the component props.
 * @param props.style the CSS styles.
 * @param props.className the CSS class name.
 * @param props.label the label for the input.
 * @param props.passwordMask whether to show password mask.
 * @param props.showPasswordAriaLabel the aria label for the show password button.
 * @param props.type the type of the input.
 * @param props.value the value of the input.
 * @param props.props the additional input props.
 * @returns the React element.
 */
const RsInput = ({style, className, label, passwordMask, showPasswordAriaLabel, type, value, ...props}: RsInputProps) => {
  const [visible, setVisible] = useState(false)
  const {id} = useComponentData()
  const aria = useAriaAttributes({labeled: !!label})

  const toggleVisible = useCallback(() => setVisible(v => !v), [])

  const input = passwordMask
    ? <InputGroup inside>
      <Input id={id} {...aria} type={visible ? 'text' : 'password'} value={value ?? ''} {...props}/>
      <InputGroup.Button aria-label={showPasswordAriaLabel} aria-pressed={visible} onClick={toggleVisible}>
        {visible ? <EyeIcon/> : <EyeSlashIcon/>}
      </InputGroup.Button>
    </InputGroup>
    : <Input id={id} {...aria} type={type} value={value ?? ''} {...props}/>

  return <Labeled label={label} style={style} className={className} passAriaToChildren={false}>
    {input}
  </Labeled>
}

export const rsInput = define(RsInput, 'RsInput')
  .name('Input')
  .category(fieldsCategory)
  .props({
    label: string.default('Input').hinted('Input label'),
    ...inputProps,
    type: oneOf('text', 'password', 'email', 'number', 'search', 'tel', 'url', 'time').default('text'),
    value: string.valued.uncontrolledValue(''),
    passwordMask: boolean.default(false),
    showPasswordAriaLabel: string.default('Show password')
  })
