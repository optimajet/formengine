import type {ActionEventArgs} from '@react-form-builder/core'
import {onBlur} from './onBlurEventHandler'

export const checkedEventHandlers = {
  onChange: (e: ActionEventArgs) => {
    const originalEvent = e.args[0]
    const value = originalEvent.target.checked
    e.sender.field?.setValue(value)
  },
  onBlur,
} as const
