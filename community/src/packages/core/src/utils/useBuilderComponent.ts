import type {ComponentType} from 'react'
import {useMemo} from 'react'
import {useBuilderMode} from './contexts/BuilderModeContext'

/**
 * Returns a React component based on the current builder mode.
 * @param builderComponent the component to use in the 'builder' mode.
 * @param viewerComponent the component to use in the 'viewer' mode.
 * @returns the React component based on the current builder mode.
 */
export const useBuilderComponent = <T>(builderComponent: ComponentType<T>, viewerComponent: ComponentType<T>): ComponentType<T> => {
  const builderMode = useBuilderMode()
  return useMemo(() => {
    return builderMode === 'builder' ? builderComponent : viewerComponent
  }, [builderComponent, builderMode, viewerComponent])
}
