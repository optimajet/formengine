import {AsyncFunction} from '../../utils/AsyncFunction'
import type {ActionParameters, Func} from './types'

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
