import styled from '@emotion/styled'
import {boolean, define, node, oneOf} from '@react-form-builder/core'
import {Message} from 'rsuite'
import {staticCategory} from './categories'

const SMessage = styled(Message)`
  .rs-message-header {
    overflow: initial;
  }
`

export const rsMessage = define(SMessage, 'RsMessage')
  .name('Message')
  .category(staticCategory)
  .props({
    children: node,
    closable: boolean.default(false),
    header: node,
    type: oneOf('info', 'success', 'warning', 'error').default('info')
      .withEditorProps({creatable: false})
  })
