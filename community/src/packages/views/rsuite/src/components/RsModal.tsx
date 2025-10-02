import {boolean, define, event, oneOf, string} from '@react-form-builder/core'
import type {SyntheticEvent} from 'react'
import {useCallback} from 'react'
import type {ModalProps} from 'rsuite'
import {Modal} from 'rsuite'
import {modalCategory} from './categories'

/**
 * Props for the RsModal component.
 */
export interface RsModalProps extends ModalProps {
  /**
   * Custom close handler function.
   */
  handleClose?: () => void
}

/**
 * A modal component that displays content in an overlay dialog.
 * @param props the component props.
 * @returns the React element.
 */
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
  .category(modalCategory)
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
