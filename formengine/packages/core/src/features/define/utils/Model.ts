import {observer} from 'mobx-react'
import type {ComponentType} from 'react'
import type {Css} from '../../style/types'
import type {SchemaType} from '../../validation'
import type {ActionsInitializer, ComponentKind} from '../types'
import type {ComponentPropertyBindType} from './ComponentPropertyBindType'

/**
 * Represents component metadata for the form viewer.
 * @template T the type of React component properties.
 */
export class Model<T = any> {
  readonly #name?: string
  /**
   * The React component.
   */
  readonly component: ComponentType<T>

  /**
   * Creates component metadata for the form viewer.
   * @param component the React component.
   * @param name the component name.
   * @param actionsInitializer the function to initialize actions in the component.
   * @param valued the name of the component property where the component value is stored.
   * @param valueType the type of the component value.
   * @param defaultProps the component's default property values.
   * @param css the component's CSS values.
   * @param wrapperCss the component's wrapper CSS values.
   * @param typeName the component type name.
   * @param kind the component kind.
   * @param readOnly the name of the component property that stores the read-only flag.
   * @param propsBindingTypes the component property binding types.
   * @param uncontrolledValue the value for the uncontrolled (undefined) state.
   * @param disabled the name of the component property that stores the disabled flag.
   * @template T the type of React component properties.
   */
  constructor(
    component: ComponentType<T>,
    name?: string,
    readonly actionsInitializer?: ActionsInitializer,
    readonly valued?: string,
    readonly valueType?: SchemaType,
    readonly defaultProps?: Readonly<Record<string, any>>,
    readonly css?: Css,
    readonly wrapperCss?: Css,
    readonly typeName?: string,
    readonly kind: ComponentKind = 'component',
    readonly readOnly?: string,
    readonly propsBindingTypes: Readonly<Record<string, ComponentPropertyBindType>> = {},
    readonly uncontrolledValue?: unknown,
    readonly disabled?: string,
  ) {
    this.component = observer(component)
    this.component.displayName = component.displayName || component.name
    this.#name = name
  }

  /**
   * @returns the component name, or type if there is no component name.
   */
  get name() {
    return this.#name ?? this.type
  }

  /**
   * @returns the component type name.
   */
  get type(): string {
    return this.typeName || this.component.displayName || this.component.name
  }
}
