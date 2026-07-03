import {boolean, oneOfStrict} from '@react-form-builder/core'
import {size} from './sharedProps'

/**
 * Shared layout props for grouped inputs.
 */
export const groupLayoutProps = {
  spacing: size,
  align: oneOfStrict('start', 'center', 'end', 'stretch'),
  justify: oneOfStrict('start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'),
  wrap: oneOfStrict('wrap', 'nowrap', 'wrap-reverse'),
  grow: boolean.default(false),
}

/**
 * Grouped components props.
 */
export interface GroupLayoutProps {
  /**
   * Spacing between items.
   */
  gap?: string | number
  /**
   * Align items within the group.
   */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /**
   * Justify content within the group.
   */
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  /**
   * Wrap behavior for items.
   */
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  /**
   * Whether items should grow to fill available space.
   */
  grow?: boolean
}
