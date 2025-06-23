import type {SchemaType, SchemaTypeMap} from '../../../validation'
import type {EditorType} from '../../types/annotations/EditorType'
import {ArrayBuilder} from './ArrayBuilder'
import {BaseBuilder} from './BaseBuilder'
import {OneOfBuilder} from './OneOfBuilder'
import {SomeOfBuilder} from './SomeOfBuilder'
import {TypedBuilder} from './TypedBuilder'

/**
 * The builder class to define the metadata property of the form builder component.
 * @template T the property type.
 */
export class AnnotationBuilder<T> extends BaseBuilder<T> {

  /**
   * Creates a component property metadata builder.
   * @param editor the property editor type.
   * @template T the property type.
   */
  constructor(editor: EditorType) {
    super()
    this.annotation = {editor}
  }

  /**
   * Creates a component property metadata builder.
   * @param editor the property editor type.
   * @template T the property type.
   * @returns the component property metadata builder.
   */
  static create = <T>(editor: EditorType) => new this<T>(editor)

  /**
   * Sets the property as a "array" property.
   * @returns the instance of the metadata property builder.
   */
  get array() {
    return new ArrayBuilder<T[] | undefined>()
      .setup({...this.options, ...this.annotation, type: 'array'})
  }

  /**
   * Sets the field type for the component property.
   * @param type the field type.
   * @returns the instance of the metadata property builder.
   */
  typed<T extends SchemaType>(type: T) {
    return new TypedBuilder<SchemaTypeMap[T] | undefined>()
      .setup({...this.options, ...this.annotation, type})
  }

  /**
   * Sets the property as a "single select" property.
   * @param values the possible values for the property.
   * @returns the instance of the metadata property builder.
   */
  oneOf<U extends string | number>(...values: U[]) {
    const result = new OneOfBuilder<U>().setup({...this.options, ...this.annotation, type: 'enum'})
    result.values = values
    return result
  }

  /**
   * Sets the property as a "multiple select" property.
   * @param values the possible values for the property.
   * @returns the instance of the metadata property builder.
   */
  someOf<U extends string | number>(...values: U[]) {
    const result = new SomeOfBuilder<U>().setup({...this.options, ...this.annotation, type: 'enum'})
    result.values = values
    return result
  }
}
