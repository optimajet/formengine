import {boolean, define, node, oneOf} from '@react-form-builder/core'
import cx from 'clsx'
import type {MessageProps} from 'rsuite'
import {Message} from 'rsuite'
import {staticCategory} from './categories'
import styles from './RsMessage.module.css'

const RsMessage = ({className, ...props}: MessageProps) => {
  return <Message {...props} className={cx(styles.message, className)}/>
}

export const rsMessage = define(RsMessage, 'RsMessage')
  .name('Message')
  .category(staticCategory)
  .props({
    children: node,
    closable: boolean.default(false),
    header: node,
    type: oneOf('info', 'success', 'warning', 'error').default('info')
      .withEditorProps({creatable: false})
  })
