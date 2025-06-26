import type {SchemaType} from '../../../validation'
import {TypedBuilder} from './TypedBuilder'

/**
 * The builder class to define the metadata property of the form builder component.
 * Used for properties where the property value is an array.
 * @template T the property type.
 */
export class ArrayBuilder<T> extends TypedBuilder<T> {
  subType?: SchemaType

  /**
   * Sets the component's value type to an array of strings.
   * @returns the modified instance of the builder.
   */
  get ofString() {
    const builder = new ArrayBuilder<string[] | undefined>()
      .setup({...this.options, ...this.annotation, type: 'array', editor: 'arrayOfString'})
    builder.subType = 'string'
    return builder
  }

  /**
   * Sets the component's value type to an array of objects.
   * @returns the modified instance of the builder.
   */
  get ofObject() {
    const builder = new ArrayBuilder<object[] | undefined>()
      .setup({...this.options, ...this.annotation, type: 'array'})
    builder.subType = 'object'
    return builder
  }
}
