import type {ActionDefinition} from './ActionDefinition'

/**
 * Represents a named action definition.
 */
export type NamedActionDefinition = {
  /**
   * The name of action definition.
   */
  name: string
  /**
   * The definition of an action.
   */
  actionDefinition: ActionDefinition
}
