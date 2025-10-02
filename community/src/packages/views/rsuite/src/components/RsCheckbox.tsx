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
    children: string.named('Label').default('Checkbox'),
    checked: boolean.hinted('Specifies whether the checkbox is selected')
      .valued.default(true).uncontrolledValue(false),
    disabled: disabled.hinted('Whether disabled').default(false),
    readOnly,
    indeterminate: boolean.hinted('When being a checkbox, setting styles after the child part is selected').default(false),
    inline: boolean.hinted('Inline layout').default(false),
    title: string.hinted('HTML title'),
    onChange: event,
  })
