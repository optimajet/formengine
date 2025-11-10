import styled from '@emotion/styled'
import {boolean, define, disabled, event, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import type {CheckboxProps} from 'rsuite'
import {Checkbox} from 'rsuite'
import {readOnly} from '../commonProperties'
import {fieldsCategory} from './categories'
import {requiredStyle} from './components/Labeled'

const SCheckbox = styled(Checkbox)`
  &.required label::after {
    ${requiredStyle};
  }
`

const RsCheckbox = (props: CheckboxProps<any>) => {
  const Component = useMemo(
    () => (props.children as string)?.length ? SCheckbox : Checkbox,
    [props.children])
  return <Component {...props}/>
}

export const rsCheckbox = define(RsCheckbox, 'RsCheckbox')
  .name('Checkbox')
  .category(fieldsCategory)
  .props({
    children: string.default('Checkbox'),
    checked: boolean
      .valued.default(true).uncontrolledValue(false),
    disabled: disabled.default(false),
    readOnly,
    indeterminate: boolean,
    inline: boolean.default(false),
    title: string,
    onChange: event,
  })
