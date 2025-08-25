import {boolean, define, event, oneOf, string} from '@react-form-builder/core'
import type {SyntheticEvent} from 'react'
import {useCallback} from 'react'
import type {ModalProps} from 'rsuite'
import {Modal} from 'rsuite'

interface RsModalProps extends ModalProps {
  handleClose?: () => void
}

const RsModal = (props: RsModalProps) => {
  const {children, handleClose, onClose, ...rest} = props

  const close = useCallback((e: SyntheticEvent) => {
    handleClose?.()
    onClose?.(e)
  }, [handleClose, onClose])

  return <Modal {...rest} onClose={close}>
    {children}
  </Modal>
}

const modalSize = oneOf('xs', 'sm', 'md', 'lg', 'full')
  .labeled('Extra small', 'Small', 'Medium', 'Large', 'Full')
  .default('md')

export const rsModal = define(RsModal, 'RsModal')
  .name('RsModal')
  .props({
    autoFocus: boolean.default(true),
    backdrop: boolean.default(true),
    backdropClassName: string,
    classPrefix: string,
    dialogClassName: string,
    enforceFocus: boolean.default(true),
    keyboard: boolean.default(true),
    overflow: boolean.default(true),
    size: modalSize,
    onOpen: event,
    onClose: event,
  })
  .componentRole('modal')
  .hideFromComponentPalette()
