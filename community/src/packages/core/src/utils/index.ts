import {observer} from 'mobx-react'
import type {ComponentType} from 'react'
import {ComponentStore} from '../stores/ComponentStore'

/**
 * Type predicate, asserts that the value is a string. **Internal use only.**
 * @param value the value.
 * @returns true if the value is a string, false otherwise.
 */
export function isString(value: any): value is string {
  return typeof value === 'string'
}

/**
 * Type predicate, asserts that the value is a number. **Internal use only.**
 * @param value the value.
 * @returns true if the value is a number, false otherwise.
 */
export function isNumber(value: any): value is number {
  return typeof value === 'number'
}

/**
 * Type predicate, asserts that the value is a Promise. **Internal use only.**
 * @param value the value.
 * @returns true if the value is a Promise, false otherwise.
 */
export function isPromise<T = any>(value: any): value is Promise<T> {
  return typeof value === 'object' && typeof value.then === 'function'
}

/**
 * Type predicate, asserts that the value is a {@link Record}. **Internal use only.**
 * @param value the value.
 * @returns true if the value is a Record, false otherwise.
 */
export function isRecord(value: any): value is Record<string, unknown> {
  return typeof value === 'object'
}

/**
 * Creates the observable React component. **Internal use only.**
 * @param displayName the displayName value of the React component.
 * @param component the React component.
 * @returns the observable React component.
 */
export function namedObserver<T extends ComponentType<any>>(displayName: string, component: T) {
  const observerComponent = observer(component)
  observerComponent.displayName = displayName
  return observerComponent
}

/**
 * The empty component settings object. **Internal use only.**
 */
export const emptyComponentStore = new ComponentStore('', '')
