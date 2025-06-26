import type {ActionDefinition, ParameterType} from '../types'
import type {ActionEventArgs} from './ActionEventArgs'

/**
 * The defineAction helper type. **Internal use only.**
 * @param name the action name.
 * @param func the action handler.
 * @param params the definition of action parameters.
 * @param description the action description.
 * @template T the type of action parameter.
 * @returns the definition of an action.
 */
export type DefineActionHelper = <T>(name: string, func: ActionHandler<T>, params?: ParameterDefinition<T>[], description?: string) => ActionDefinition

/**
 * The type to describe the action parameter.
 * @template T the type of action parameter.
 */
export type ParameterDefinition<T> = [PropertyKey<T>, ParameterType]

/**
 * Component property key type.
 * @template T the type of action parameter
 */
export type PropertyKey<T> = keyof T & string

/**
 * Action function type.
 * @param e the action arguments.
 * @param params the action parameters arguments.
 * @template T the type of action parameters.
 */
export type ActionHandler<T> = (e: ActionEventArgs, params: { [k in keyof T]: any }) => void | Promise<void>
