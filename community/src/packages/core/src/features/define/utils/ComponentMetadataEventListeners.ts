import type {IStore} from '../../../stores/IStore'
import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'

/**
 * Component metadata event listeners.
 */
export interface ComponentMetadataEventListeners {
  /**
   * The callback function that is called when the component is selected.
   * @param node the selected component data.
   * @param self the component data.
   */
  onSelectNode?: (node: ComponentData, self: ComponentData) => void

  /**
   * The callback function that is called when a component is created and added to a form.
   * @param node the created component data.
   * @param store the form viewer settings.
   */
  onCreateNode?: (node: ComponentData, store: IStore) => void
}
