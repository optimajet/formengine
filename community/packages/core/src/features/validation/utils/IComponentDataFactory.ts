import type {ComponentStore} from '../../../stores/ComponentStore'
import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'

/**
 * The factory for creating ComponentData instances. **Internal use only.**
 */
export interface IComponentDataFactory {

  /**
   * Creates the element for the component tree. **Internal use only.**
   * @param componentStore the component settings.
   * @param deferFieldCalculation if true, then the calculated field must be explicitly initialized.
   * @returns the element for the component tree.
   */
  createComponentData(componentStore: ComponentStore, deferFieldCalculation: boolean): ComponentData

}
