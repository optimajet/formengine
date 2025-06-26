import type {Meta} from './Meta'
import type {Model} from './Model'

/**
 * Description of the React component that connects to the form builder.
 * Contains metadata for the form builder and metadata for the form viewer.
 */
export interface BuilderComponent {

  /**
   * The component metadata for the form builder.
   */
  readonly meta: Meta

  /**
   * The component metadata for the form viewer.
   */
  readonly model: Model

  /**
   * The name of the component category in the designer.
   */
  readonly category?: string
}
