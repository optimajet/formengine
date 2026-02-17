import type {ModalProps} from '@mantine/core'
import {Modal} from '@mantine/core'
import {boolean, define, event, node, number, string} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {useCallback} from 'react'
import {overlaysCategory} from './internal/categories'
import {description} from './internal/sharedProps'

/**
 * Props for the MtDialog component.
 */
interface MtDialogProps extends Partial<Omit<ModalProps, 'onClose | opened'>> {
  /**
   * Flag if true, the modal window should be displayed, false otherwise.
   */
  open?: boolean

  /**
   * The function that should be called when the modal window is closed.
   */
  handleClose?: () => void

  /**
   * Called when modal/drawer is closed.
   */
  onClose?: () => void

  /**
   * Controls opened state.
   */
  opened?: boolean

  /**
   * Optional description text displayed under the title.
   */
  description?: string

  /**
   * The main content of the dialog.
   */
  children?: ReactNode

  /**
   * Callback fired when the dialog open state changes.
   */
  onOpenedChange?: (open: boolean) => void

  /**
   * Whether to show the close button in the dialog header.
   */
  showCloseButton?: boolean
}

/**
 * Mantine dialog component for React Form Builder.
 * @param props component properties.
 * @returns dialog component.
 */
export function MtDialog(props: MtDialogProps) {
  const {
    title,
    description,
    children,
    open,
    handleClose,
    onClose,
    onOpenedChange,
    showCloseButton = true,
    ...others
  } = props

  const handleOnClose = useCallback(() => {
    handleClose?.()
    onClose?.()
  }, [handleClose, onClose])

  return (
    <Modal
      {...others}
      opened={open ?? false}
      onClose={handleOnClose}
      title={title}
      withCloseButton={showCloseButton}
    >
      {description && <p>{description}</p>}
      {children}
    </Modal>
  )
}

export const mtDialog = define(MtDialog, 'MtDialog')
  .category(overlaysCategory)
  // TODO FE-1803 add support for overlayProps, transitionProps, closeButtonProps, scrollAreaComponent, and removeScrollProps.
  .props({
    title: string.default('Dialog Title'),
    description,
    children: node,
    showCloseButton: boolean.default(true),
    withOverlay: boolean.default(true),
    centered: boolean.default(false),
    closeOnClickOutside: boolean.default(true),
    closeOnEscape: boolean.default(true),
    fullScreen: boolean.default(false),
    size: string,
    radius: string,
    padding: string,
    shadow: string,
    xOffset: string,
    yOffset: string,
    zIndex: number,
    lockScroll: boolean.default(true),
    trapFocus: boolean.default(true),
    returnFocus: boolean.default(true),
    keepMounted: boolean.default(false),
    withinPortal: boolean.default(true),
    stackId: string,
    onOpenedChange: event,
  })
  .componentRole('modal')
  .hideFromComponentPalette()
