import type {ComponentType, ReactElement} from 'react'
import {createElement} from 'react'
import {useBuilderMode} from './contexts/BuilderModeContext'

/**
 * Returns a React element for the builder or viewer component based on the current builder mode.
 * @param builderComponent the component to use in the 'builder' mode.
 * @param viewerComponent the component to use in the 'viewer' mode.
 * @param props the props forwarded to the selected component.
 * @returns the React element for the selected component.
 */
export const useBuilderComponent = <T>(
  builderComponent: ComponentType<T>,
  viewerComponent: ComponentType<T>,
  props: T
): ReactElement => {
  const builderMode = useBuilderMode()
  const Component = builderMode === 'builder' ? builderComponent : viewerComponent
  return createElement(Component as ComponentType<any>, props as any)
}
