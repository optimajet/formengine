import type {ActionEventArgs} from './utils/ActionEventArgs'

/**
 * Event handler function type.
 * @param e the action arguments.
 * @param args the action parameters.
 */
export type ActionEventHandler = (e: ActionEventArgs, args?: Record<string, any>) => void | Promise<void>
