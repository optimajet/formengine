import type {ComponentStore} from '../../stores/ComponentStore'
import type {ActionDefinition, ActionEventHandler, DefineActionHelper, EventName} from '../event'

/**
 * The type of function that initializes an actions on a component. **Internal use only.**
 * @param props the component's property settings.
 * @param def the helper to create an action event handler.
 * @returns the Record with action event handlers.
 */
export type ActionsInitializer = (props: ComponentStore['props'], def: DefineActionHelper) => Record<EventName, ActionEventHandler | ActionDefinition>

/**
 * The component kind type.
 */
export type ComponentKind = 'container' | 'component' | 'template' | 'repeater'
