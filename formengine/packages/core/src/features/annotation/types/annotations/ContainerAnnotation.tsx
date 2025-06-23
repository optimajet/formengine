import type {ComponentData} from '../../../../utils/contexts/ComponentDataContext'
import {Annotation} from './Annotation'

/**
 * Metadata for the component container property for the form builder.
 * The Container property of a component can contain other React components.
 */
export class ContainerAnnotation extends Annotation {

  /**
   * The function that checks whether a child component can be inserted into a parent component.
   */
  insertPredicate?: (self: ComponentData, child: ComponentData) => boolean
}
