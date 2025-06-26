import type {ComponentType} from 'react'
import type {ComponentData} from './utils/contexts/ComponentDataContext'

/**
 * Properties of a form component tree element.
 */
export interface ComponentTreeProps {
  /**
   * An array of child elements of the tree.
   */
  data: ComponentData[]

  /**
   * The component displaying an item.
   */
  componentDataViewer?: ComponentType
}
