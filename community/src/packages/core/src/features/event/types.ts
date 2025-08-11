import type {KeySymbol} from '../../consts'
import {AsyncFunction} from '../../utils/AsyncFunction'

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
 * Represents a set of action definitions.
 */
export type ActionValues = Record<string, ActionDefinition>

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

/**
 * Represents the definition of an action.
 */
export class ActionDefinition {

  /**
   * Creates a new instance of the ActionDefinition class.
   * @param func the function of an action.
   * @param body the source code of the Action.
   * @param params the parameters of the Action.
   */
  constructor(
    public readonly func: Func,
    public readonly body?: string,
    public readonly params: ActionParameters = {},
  ) {
  }

  /**
   * Creates an action from the function.
   * @param func the function of an action.
   * @param params the parameters of the Action.
   * @returns the new instance of the ActionDefinition class.
   */
  static functionalAction(func: Func, params: ActionParameters = {}): ActionDefinition {
    return new ActionDefinition(func, undefined, params)
  }

  /**
   * Creates an action from the source code.
   * @param body the source code of the Action.
   * @param params the parameters of the Action.
   * @returns the new instance of the ActionDefinition class.
   */
  static sourceAction(body: string, params: ActionParameters = {}): ActionDefinition {
    const func = AsyncFunction('e, args', body)
    return new ActionDefinition(func, body, params)
  }

  /**
   * Correctly creates the {@link ActionDefinition} from deserialized data.
   * @param value the deserialized data.
   * @returns the ActionDefinition instance.
   */
  static createFromObject(value: any) {
    return ActionDefinition.sourceAction(value.body, value.params)
  }
}

/**
 * Converts the input object to an ActionValues object. **Internal use only.**
 * @param obj the input object.
 * @returns the converted ActionValues object.
 */
export const createActionValuesFromObject = (obj: any) => {
  const result: ActionValues = {}
  if (!obj) return result

  Object.keys(obj).forEach(key => {
    const value = obj[key]
    result[key] = ActionDefinition.createFromObject(value)
  })
  return result
}

/**
 * The type of arbitrary function that returns void or Promise&lt;void&gt;.
 */
export type Func = (...arg: any[]) => void | Promise<void>
