import type {ActionEventArgs} from './utils/ActionEventArgs'

/**
 * Event handler function type.
 * @param e the action arguments.
 */
export type ActionEventHandler = (e: ActionEventArgs) => void | Promise<void>
