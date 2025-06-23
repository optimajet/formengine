import styled from '@emotion/styled'
import {boolean, define, node, oneOf} from '@react-form-builder/core'
import {Message} from 'rsuite'

const SMessage = styled(Message)`
  .rs-message-header {
    overflow: initial;
  }
`

export const rsMessage = define(SMessage, 'RsMessage')
  .name('Message')
  .props({
    children: node,
    closable: boolean.default(false),
    header: node,
    type: oneOf('info', 'success', 'warning', 'error').default('info')
  })
