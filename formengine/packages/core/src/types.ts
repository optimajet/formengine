import type {ReactNode} from 'react'

/**
 * React wrapper component properties.
 */
export interface WrapperProps {
  /**
   * The React child node.
   */
  children: ReactNode
  /**
   * The CSS class name.
   */
  className?: string
}

/**
 * Display resolution type.
 */
export type ViewMode = 'desktop' | 'mobile' | 'tablet'

/**
 * Properties of the root component of the form. **Internal use only.**
 */
export interface ScreenProps {
  /**
   * The React child node.
   */
  children: ReactNode

  /**
   * If true, the children are in disabled state.
   */
  disabled?: boolean

  /**
   * If true, the children are in read-only state.
   */
  readOnly?: boolean
}

/**
 * Value setting function type.
 * @param value the value.
 * @template T the value type.
 */
export type Setter<T = any> = (value: T) => void
