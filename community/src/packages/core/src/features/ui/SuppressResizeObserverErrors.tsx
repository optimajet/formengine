import type {ReactNode} from 'react'
import {useEffect, useState} from 'react'

/**
 * Represents the props for the SuppressResizeObserverErrors component. **Internal use only.**
 */
export interface SuppressResizeObserverErrorsProps {
  /**
   * The React child node.
   */
  children: ReactNode
}

/**
 * SuppressResizeObserverErrors component is used to suppress ResizeObserver errors. **Internal use only.**
 * @param props the component props.
 * @param props.children the child elements to render.
 * @returns the rendered child elements.
 */
export const SuppressResizeObserverErrors = ({children}: SuppressResizeObserverErrorsProps) => {
  const [defaultOnErrorFn] = useState(globalThis.onerror)

  useEffect(() => {
    globalThis.onerror = (event) => {
      if (event?.toString().search('ResizeObserver') !== -1) {
        const resizeObserverErrDiv = document.getElementById(
          'webpack-dev-server-client-overlay-div'
        )
        const resizeObserverErr = document.getElementById(
          'webpack-dev-server-client-overlay'
        )
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute('style', 'display: none')
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute('style', 'display: none')
        }
        return true
      }
      return false
    }
    return () => {
      globalThis.onerror = defaultOnErrorFn
    }
  }, [defaultOnErrorFn])

  return <>{children}</>
}
