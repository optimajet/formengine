import {makeAutoObservable} from 'mobx'
import {KeySymbol} from '../consts'
import type {ActionData, EventName} from '../features/event'
import type {Css} from '../features/style/types'
import type {BoundValueSchema} from '../features/validation'
import {nameObservable} from '../utils/observableNaming'

let actionDataCounter = 0

function initActionDataKey(actionData: ActionData) {
  if (actionData[KeySymbol]) return
  ++actionDataCounter
  actionData[KeySymbol] = `actionData_${actionDataCounter}`
}

function initActionDataKeys(componentStore: ComponentStore) {
  const events = componentStore.events
  if (events) {
    Object.values(events)
      .forEach(data => data.forEach(initActionDataKey))
  }
  componentStore.children?.forEach(initActionDataKeys)
}

/**
 * The component property value type.
 */
export type ComponentPropertyComputeType = 'function' | 'localization'

/**
 * The value of the component property.
 * @template T the value type.
 */
export interface ComponentProperty<T = any> {
  /**
   * The simple value of a component property.
   */
  value?: T
  /**
   * Source code of the function for calculating the value of a component property.
   */
  fnSource?: string
  /**
   * Type of the component's calculated property. If not specified - the value from value is used.
   */
  computeType?: ComponentPropertyComputeType

  /**
   * The component property editor type, only used in Designer mode.
   */
  editorType?: string
}

/**
 * Returns true if the property value is calculated by the function, otherwise false. **Internal use only.**
 * @param componentProperty the component property.
 * @returns true if the property value is calculated by the function, otherwise false.
 */
export function isFunctionalProperty(componentProperty?: ComponentProperty) {
  return componentProperty?.computeType === 'function'
}

/**
 * Returns true if the property value is localized, otherwise false. **Internal use only.**
 * @param componentProperty the component property.
 * @returns true if the property value is localized, otherwise false.
 */
export function isLocalizedProperty(componentProperty?: ComponentProperty) {
  return componentProperty?.computeType === 'localization'
}

/**
 * Returns true if the property value is calculated, otherwise false. **Internal use only.**
 * @param componentProperty the component property.
 * @returns true if the property value is calculated, otherwise false.
 */
export function isComputedProperty(componentProperty?: ComponentProperty) {
  return isFunctionalProperty(componentProperty) || isLocalizedProperty(componentProperty)
}

/**
 * Returns the data key of the component. **Internal use only.**
 * @param componentStore the component store.
 * @returns the data key of the component.
 */
export function dataKey(componentStore: ComponentStore) {
  return componentStore.dataKey ?? componentStore.key
}

/**
 * The arbitrary HTML attributes for the component.
 */
export type HtmlAttribute = Record<string, string>

/**
 * Styles for a device.
 */
export type ComponentDeviceStyle = {
  /**
   * The CSS string.
   */
  string?: string
}

/**
 * The type for the style property of a React component.
 */
export type ComponentStyle = {
  /**
   * Styles for an arbitrary device.
   */
  any?: ComponentDeviceStyle
  /**
   * Styles for mobile devices.
   */
  mobile?: ComponentDeviceStyle
  /**
   * Styles for tablet devices.
   */
  tablet?: ComponentDeviceStyle
  /**
   * Styles for desktop devices.
   */
  desktop?: ComponentDeviceStyle
}

/**
 * Modal settings for serialization in JSON.
 */
export type ModalComponentStore = {
  /**
   * The component properties.
   */
  props: Record<string, ComponentProperty>

  /**
   * The set of event handlers.
   */
  events?: Record<EventName, ActionData[]>
}

//No functions here
/**
 * Component settings for serialization in JSON.
 */
export class ComponentStore {

  /**
   * The React component key.
   */
  key = ''

  /**
   * The component data key.
   */
  dataKey?: string

  /**
   * The component type of the form viewer.
   */
  type = ''

  /**
   * The component properties.
   */
  props: Record<string, ComponentProperty> = {}

  /**
   * The component CSS styles.
   */
  css?: Css

  /**
   * The component wrapper CSS styles.
   */
  wrapperCss?: Css

  /**
   * The component styles for the `style` attribute.
   */
  style?: ComponentStyle

  /**
   * The component wrapper styles for the `style` attribute.
   */
  wrapperStyle?: ComponentStyle

  /**
   * The set of event handlers.
   */
  events?: Record<EventName, ActionData[]>

  /**
   * The array of child components.
   */
  children?: ComponentStore[]

  /**
   * The component value validation settings.
   */
  schema?: BoundValueSchema

  /**
   * The set of arbitrary HTML attributes added to the component.
   */
  htmlAttributes?: HtmlAttribute[]

  /**
   * The tooltip settings.
   */
  tooltipProps?: Record<string, ComponentProperty>

  /**
   * The modal settings.
   */
  modal?: ModalComponentStore

  /**
   * The name of the occupied component property in the parent component.
   */
  slot?: string

  /**
   * The condition for binding a child element to a parent element.
   */
  slotCondition?: string

  /**
   * The expression or function to conditionally render a component.
   */
  renderWhen?: ComponentProperty

  /**
   * Disables data binding for the component.
   */
  disableDataBinding?: ComponentProperty<boolean>

  /**
   * Creates the component settings.
   * @param key the React component key.
   * @param type the component type of the form viewer.
   */
  constructor(key: string, type: string) {
    this.key = key
    this.type = type
    makeAutoObservable(this, undefined, {name: nameObservable('ComponentStore', {key: key})})
  }

  /**
   * Correctly creates the {@link ComponentStore} from deserialized data.
   * @param value the deserialized data.
   * @returns the component Store.
   */
  static createFromObject(value: any) {
    const result = Object.assign(new ComponentStore(value.key, value.type), value)
    initActionDataKeys(result)
    return result
  }

  /**
   * Adds the event handler for component.
   * @param store the target {@link ComponentStore}.
   * @param eventName the target event name.
   * @param data the {@link ActionData}.
   */
  static addEventHandler(store: ComponentStore, eventName: string, data: ActionData) {
    initActionDataKey(data)
    store.events ??= {}
    store.events[eventName] ??= []
    store.events[eventName].push(data)
  }

  /**
   * Returns a clone of the specified component settings.
   * @param store the component settings.
   * @returns the clone of the specified component settings.
   */
  static clone(store: ComponentStore) {
    const obj = JSON.parse(JSON.stringify(store))
    return ComponentStore.createFromObject(obj)
  }
}
