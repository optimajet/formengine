import type {FormControlProps} from '@mui/material'
import type {DisabledProps} from '../DisabledProps'
import type {ReadOnlyProps} from '../ReadOnlyProps'

/**
 * The props for the MuiControl component.
 */
export interface MuiControlProps extends FormControlProps, DisabledProps, ReadOnlyProps {
  /**
   * The label for the form control.
   */
  label?: string
  /**
   * The helper text for the form control.
   */
  helperText?: string
}
