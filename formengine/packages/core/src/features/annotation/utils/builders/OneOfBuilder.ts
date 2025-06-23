import {QuantifierBuilder} from './QuantifierBuilder'

/**
 * The builder class to define the metadata property of the form builder component.
 * Used for properties where the property value can be selected from one of the predefined values.
 * @template T the property type.
 */
export class OneOfBuilder<T> extends QuantifierBuilder<T> {

  /**
   * Sets the radio buttons as the component's property editor.
   * @returns the modified instance of the builder.
   */
  radio() {
    return this.setup({editor: 'radio'})
  }

  /**
   * Sets the default value for the component property.
   * @param value the default value.
   * @returns the modified instance of the builder.
   */
  default(value: T): this {
    return super.default(value)
  }
}
