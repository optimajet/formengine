import styled from '@emotion/styled'
import {boolean, define, disabled, event, oneOf, string} from '@react-form-builder/core'
import {Toggle} from 'rsuite'
import {controlColor, readOnly} from '../commonProperties'
import {fieldsCategory} from './categories'
import {requiredStyle} from './components/Labeled'

const SToggle = styled(Toggle)`
  &.required .rs-toggle-label::after {
    ${requiredStyle};
  }
`

export const rsToggle = define(SToggle, 'RsToggle')
  .name('Toggle')
  .category(fieldsCategory)
  .props({
    children: string.named('Label'),
    checked: boolean.valued.default(true).uncontrolledValue(false),
    checkedChildren: string.named('Checked text'),
    unCheckedChildren: string.named('Unchecked text'),
    disabled: disabled.hinted('Whether disabled').default(false),
    readOnly,
    size: oneOf('sm', 'md', 'lg')
      .labeled('Small', 'Medium', 'Large')
      .default('md')
      .withEditorProps({creatable: false}),
    color: controlColor,
    loading: boolean.default(false),
    onChange: event,
  })
