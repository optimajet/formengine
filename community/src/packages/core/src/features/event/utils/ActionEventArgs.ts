import type {SyntheticEvent} from 'react'
import type {Store} from '../../../stores/Store'
import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'
import {isUndefined} from '../../../utils/tools'
import type {CellInfo} from '../../table/CellInfo'
import {createDataProxy} from './createComponentDataProxy'

/**
 * Arguments passed to the event handler.
 */
export class ActionEventArgs {
  #componentDataProxy: any
  #parentComponentDataProxy: any
  #rootComponentDataProxy: any

  /**
   * The index of the component in the array, if the component is in the array.
   */
  readonly index?: number

  /**
   * Creates arguments for the event handler.
   * @param type the event type.
   * @param sender the component that triggered the event.
   * @param store the form viewer settings.
   * @param args the event arguments.
   * @param renderedProps the component properties that were used to render the sender component.
   * @param cellInfo the information about the current table cell.
   */
  constructor(
    readonly type: string,
    readonly sender: ComponentData,
    readonly store: Store,
    readonly args: any[],
    readonly renderedProps: Record<string, any>,
    readonly cellInfo?: CellInfo,
  ) {
    this.index = sender.nearestIndex
    const indexExists = typeof this.index === 'number'
    const componentData = sender.dataRoot
    this.#componentDataProxy = createDataProxy(componentData)
    if (indexExists) {
      const parentComponentData = componentData.parent?.dataRoot ?? this.store.formData
      this.#parentComponentDataProxy = createDataProxy(parentComponentData)
    }
    this.#rootComponentDataProxy = createDataProxy(this.store.formData)
  }

  /**
   * @returns user-defined properties for the React component that override other properties of the component.
   */
  get userDefinedProps(): Record<string, any> {
    return {...this.sender.userDefinedProps}
  }

  /**
   * Sets user-defined properties for the React component that override other properties of the component.
   * @param props the component properties.
   */
  setUserDefinedProps = (props?: Record<string, any>) => {
    this.sender.userDefinedProps = props
  }

  /**
   * @returns the event handled by the event handler.
   */
  get event(): SyntheticEvent | null {
    return this.args.find(this.#isEvent)
  }

  /**
   * @returns the first element of the event argument array, which is treated as a value.
   */
  get value() {
    return this.args.filter(v => !isUndefined(v)).find(this.#isNotEvent)
  }

  /**
   * @returns the object for reading and changing form data.
   */
  get data(): Record<string, unknown> {
    return this.#componentDataProxy
  }

  /**
   * @returns the object to read and modify parent data (available for array elements).
   */
  get parentData(): Record<string, unknown> | undefined {
    return this.#parentComponentDataProxy
  }

  /**
   * @returns the object to read and modify root form data.
   */
  get rootData(): Record<string, unknown> {
    return this.#rootComponentDataProxy
  }

  #isEvent = (value: any) => Boolean(value && value.target && value.type && value.preventDefault)
  #isNotEvent = (value: any) => !this.#isEvent(value)
}

/**
 * Description of the event argument type for the code editor.
 */
export const ActionEventArgsDeclaration = `
/**
 * Arguments passed to the event handler.
 */
declare class ActionEventArgs {

  /**
   * The event type.
   */
  readonly type: string

  /**
   * The component that triggered the event.
   */
  readonly sender: ComponentData
  
  /**
   * The component properties that were used to render the sender component.
   */
  readonly renderedProps: Record<string, any>

  /**
   * The index of the component in the array, if the component is in the array.
   */
  readonly index?: number

  /**
   * @returns user-defined properties for the React component that override other properties of the component.
   */
  get userDefinedProps(): Record<string, any>

  /**
   * Sets current props of component.
   */
  readonly setUserDefinedProps: (props: Record<string, any>) => void

  /**
   * The form viewer settings.
   */
  readonly store: Store

  /**
   * The event arguments.
   */
  readonly args: any[]

  /**
   * @returns the event handled by the event handler.
   */
  get event(): SyntheticEvent | null

  /**
   * @returns the first element of the event argument array, which is treated as a value.
   */
  get value(): any
  
  /**
   * @returns the object for reading and changing form data.
   */
  get data(): Record<string, unknown>
  
  /**
   * @returns the object to read and modify parent data (available for array elements).
   */
  get parentData(): Record<string, unknown> | undefined

  /**
   * @returns the object to read and modify root form data.
   */
  get rootData(): Record<string, unknown>
  
  /**
   * The information about the current cell.
   */
  readonly cellInfo?: CellInfo
}
`
