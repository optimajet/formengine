import type {ActionEventHandler, ActionValues} from '../event'
import {ActionDefinition} from '../event'

/**
 * Custom actions for the form viewer.
 */
export type CustomActions = Record<string, ActionDefinition | ActionEventHandler>

/**
 * Converts custom actions to the set of action definitions. **Internal use only.**
 * @param actions the custom actions.
 * @returns the set of action definitions or undefined.
 */
export function customActionsToActionsValues(actions?: CustomActions): ActionValues | undefined {
  if (!actions) return

  const result: ActionValues = {}
  Object.entries(actions).forEach(([name, value]) => {
    result[name] = value instanceof ActionDefinition
      ? value
      : ActionDefinition.functionalAction(value)
  })
  return result
}
