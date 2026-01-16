import type {FormControlProps} from '@mui/material'

/**
 * The props for the MuiControl component.
 */
export interface MuiControlProps extends FormControlProps {
  /**
   * The label for the form control.
   */
  label?: string
  /**
   * If true, the form control will be disabled.
   */
  disabled?: boolean
  /**
   * The helper text for the form control.
   */
  helperText?: string
}
