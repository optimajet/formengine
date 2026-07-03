import {observer} from 'mobx-react'
import type {ComponentType} from 'react'

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
