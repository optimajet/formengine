import type {DialogProps} from '@mui/material'
import {Dialog} from '@mui/material'
import {boolean, define, event, oneOf} from '@react-form-builder/core'
import type {SyntheticEvent} from 'react'
import {useCallback} from 'react'
import {sx} from '../commonProperties'
import {feedbackCategory} from './categories'

/**
 * Props for the MuiDialog component.
 */
export interface MuiDialogProps extends Omit<DialogProps,
  'aria-dropeffect'
  | 'aria-grabbed'
  | 'components'
  | 'componentsProps'
  | 'onKeyPress'
  | 'onKeyPressCapture'
  | 'Backdrop'
  | 'BackdropComponent'
  | 'BackdropProps'
  | 'PaperProps'
  | 'Root'
  | 'TransitionComponent'
  | 'TransitionProps'
> {
  /**
   * Custom close handler function.
   */
  handleClose?: () => void
}

/**
 * A dialog component that displays content in an overlay dialog.
 * @param props the component props.
 * @returns the React element.
 */
const MuiDialog = (props: MuiDialogProps) => {
  const {children, handleClose, onClose, ...rest} = props

  const close = useCallback((e: SyntheticEvent, reason: 'backdropClick' | 'escapeKeyDown') => {
    handleClose?.()
    onClose?.(e, reason)
  }, [handleClose, onClose])

  return <Dialog {...rest} onClose={close}>
    {children}
  </Dialog>
}

const dialogSize = oneOf('xs', 'sm', 'md', 'lg', 'xl')
  .labeled('Extra small', 'Small', 'Medium', 'Large', 'Extra large')
  .default('md')

export const muiDialog = define(MuiDialog, 'MuiDialog')
  .category(feedbackCategory)
  .props({
    open: boolean.default(false),
    fullScreen: boolean,
    fullWidth: boolean.default(false),
    maxWidth: dialogSize,
    scroll: oneOf('paper', 'body').default('paper'),
    disableEscapeKeyDown: boolean,
    onClose: event,
    sx
  })
  .componentRole('modal')
  .hideFromComponentPalette()
