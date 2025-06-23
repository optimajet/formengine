import type {ReactNode} from 'react'

/**
 * The Repeater component properties.
 */
export interface RepeaterProps {
  /**
   * The repeater value.
   */
  value: Array<Record<string, unknown>>
  /**
   * The expression or function to conditionally render a repeater item.
   */
  itemRenderWhen?: string
  /**
   * The repeater item container class name.
   */
  className?: string
  /**
   * The repeater container class name.
   */
  wrapperClassName?: string
  /**
   * The React child node.
   */
  children: ReactNode
}
