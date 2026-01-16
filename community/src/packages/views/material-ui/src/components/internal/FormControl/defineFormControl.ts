import type {Annotations} from '@react-form-builder/core'
import {boolean, disabled, event, required, string} from '@react-form-builder/core'
import type {MuiControlProps} from './types'

export const formControlProperties: Annotations<MuiControlProps> = {
  label: string.default('Label'),
  required: required,
  disabled: disabled,
  error: boolean,
  helperText: string,
  onChange: event,
}
