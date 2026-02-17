import type {ActionEventArgs} from '@react-form-builder/core'

/**
 * The event handler for the onBlur event
 * @param e the event.
 */
export const onBlur = (e: ActionEventArgs) => {
  e.sender.field?.setTouched()
}
