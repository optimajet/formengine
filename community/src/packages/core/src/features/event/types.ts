import type {KeySymbol} from '../../consts'

/**
 * The type for the event name.
 */
export type EventName = string

/**
 * The type for the parameter name.
 */
export type ParameterName = string

/**
 * Parameter type.
 */
export type ParameterType = 'string' | 'number' | 'boolean' | 'function'

/**
 * Represents a set of action parameters.
 */
export type ActionParameters = Record<ParameterName, ParameterType>

/**
 * Primitive argument value type.
 */
export type PrimitiveArgumentValue = string | number | boolean

/**
 * Function argument value type.
 */
export type FunctionArgumentValue = {
  /**
   * Argument type for function type.
   */
  type: 'fn'
  /**
   * The source code of the function for use in design mode.
   */
  body?: string
}

/**
 * The type of the argument value of the function.
 */
export type ArgumentValue = PrimitiveArgumentValue | FunctionArgumentValue

/**
 * Action type.
 */
export type ActionType = 'common' | 'code' | 'custom'

/**
 * It will be transformed in arguments before passing in action.
 */
export type Arguments = Record<ParameterName, ArgumentValue>

/**
 * Action Storage.
 * Used for add a new action, store information about it.
 */
export type ActionData = {
  /**
   * The unique action key.
   */
  [KeySymbol]?: string
  /**
   * The action name.
   */
  name: string
  /**
   * The action type.
   */
  type: ActionType
  /**
   * The action arguments.
   */
  args?: Arguments
}

/**
 * The type of arbitrary function that returns void or Promise&lt;void&gt;.
 */
export type Func = (...arg: any[]) => void | Promise<void>
