import type {ReactNode} from 'react'
import {useEffect, useState} from 'react'
import {isString} from '../../utils/isString'
import {isObject} from '../../utils/tools'

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
 * Extracts the message from an unknown error event.
 * @param event the event captured by the global error handler.
 * @returns the event message or an empty string.
 */
const getEventText = (event: unknown): string => {
  if (isString(event)) {
    return event
  }
  if (event && isObject(event) && 'message' in event) {
    const message = (event as { message?: unknown }).message
    if (isString(message)) {
      return message
    }
  }
  return ''
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
      const eventText = getEventText(event)
      if (eventText.includes('ResizeObserver')) {
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
