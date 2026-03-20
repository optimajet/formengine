import {boolean, disabled, event, oneOfStrict, required, string} from '@react-form-builder/core'
import {label, size} from './sharedProps'

/**
 * Base input props for Mantine components.
 */
export const baseInputProps = {
  size,
  label,
  description: string,
  error: string,
  readOnly: boolean.default(false),
  withAsterisk: required,
  radius: string,
  variant: oneOfStrict('filled', 'default', 'unstyled')
    .default('default'),
  disabled: disabled.default(false),
  value: string.valued.uncontrolledValue(''),
  onChange: event,
}
