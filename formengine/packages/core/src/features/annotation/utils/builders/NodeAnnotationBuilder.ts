import type {ComponentData} from '../../../../utils/contexts/ComponentDataContext'
import type {Annotation} from '../../types/annotations/Annotation'
import type {ContainerAnnotation} from '../../types/annotations/ContainerAnnotation'
import type {EditorType} from '../../types/annotations/EditorType'
import {AnnotationBuilder} from './AnnotationBuilder'

/**
 * The builder class to define the node metadata property.
 * @template T the property type.
 */
export class NodeAnnotationBuilder<T> extends AnnotationBuilder<T> {

  /**
   * The function that checks whether a child component can be inserted into a parent component.
   */
  insertPredicate?: (self: ComponentData, child: ComponentData) => boolean

  /**
   * Creates a component property metadata builder.
   * @param editor the property editor type.
   * @template T the property type.
   */
  constructor(editor: EditorType) {
    super(editor)
  }

  /**
   * Specifies a function that will create conditions that check if a child component can be bound to a parent slot.
   * @param slotConditionBuilder the function that returns a string containing the source code of the function to bind child components.
   * @returns the instance of the metadata property builder.
   */
  withSlotConditionBuilder(slotConditionBuilder: (props: any) => string): this {
    return this.setup({slotConditionBuilder})
  }

  /**
   * @inheritDoc
   */
  build(key: string): Annotation {
    const result = super.build(key) as ContainerAnnotation
    result.insertPredicate = this.insertPredicate
    return result
  }

  /**
   * Specifies a function that checks whether a child component can be inserted into a parent component.
   * @param predicate the function that returns a boolean value.
   * @returns the modified instance of the builder.
   */
  withInsertRestriction(predicate?: (self: ComponentData, child: ComponentData) => boolean) {
    const clone = this.clone()
    clone.insertPredicate = predicate
    return clone
  }
}

/**
 * Creates a component property metadata builder.
 * @param editor the property editor type.
 * @template T the property type.
 * @returns the NodeAnnotationBuilder instance.
 */
export function createNodeAnnotation<T>(editor: EditorType) {
  return new NodeAnnotationBuilder<T>(editor)
}
