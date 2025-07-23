import {ComponentProperty} from '../../../../stores/ComponentStore'
import type {ComponentData} from '../../../../utils/contexts/ComponentDataContext'
import type {NodeEditorType} from '../../utils/builders/NodeEditorType'
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

  /**
   * The default editor.
   */
  defaultEditor?: NodeEditorType

  /**
   * Returns the node editor type for the component property.
   * @param componentProperty the component property.
   * @returns the node editor type for the component property.
   */
  getNodeEditorType(componentProperty?: ComponentProperty): NodeEditorType {
    return (componentProperty?.editorType ?? this.defaultEditor ?? 'node') as NodeEditorType
  }
}
