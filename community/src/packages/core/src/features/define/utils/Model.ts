import {observer} from 'mobx-react'
import type {ComponentType} from 'react'
import type {Css} from '../../style/types'
import type {SchemaType} from '../../validation'
import type {ActionsInitializer, ComponentKind} from '../types'
import type {ComponentFeatures} from './ComponentFeature'
import {getComponentFeature} from './ComponentFeature'
import type {ComponentPropertyBindType} from './ComponentPropertyBindType'
import type {ComponentRole} from './ComponentRole'
import type {DataBindingType} from './DataBindingType'
import {cfComponentRole} from './integratedComponentFeatures'

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
   * @param dataBindingType the type of component data binding.
   * @param features the component features that provide additional information about component's characteristic.
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
    readonly dataBindingType: DataBindingType = 'none',
    readonly features: ComponentFeatures = {},
  ) {
    if (this.valued && this.dataBindingType === 'none') {
      this.dataBindingType = 'twoWay'
    }
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

  /**
   * Returns true if feature is present in the component feature set and equals value, false otherwise.
   * @param name the feature name.
   * @param value the feature value.
   * @returns true if feature is present in the component feature set and equals value, false otherwise.
   */
  hasFeatureValue(name: string, value: unknown) {
    const item = this.features[name]
    if (!item) return false

    const componentFeature = getComponentFeature(name)
    if (!componentFeature.allowMultiple) {
      return item === value
    }

    return Array.isArray(item) ? item.indexOf(value) >= 0 : false
  }

  /**
   * Returns true if feature is present in the component feature set and equals `true`, false otherwise.
   * @param name the feature name.
   * @returns true if feature is present in the component feature set and equals `true`, false otherwise.
   */
  isFeatureEnabled(name: string) {
    return this.features[name] === true
  }

  /**
   * Returns true if the role is defined in the component's roles, false otherwise.
   * @param value the component role.
   * @returns true if the role is defined in the component's roles, false otherwise.
   */
  hasComponentRole(value: ComponentRole) {
    return this.hasFeatureValue(cfComponentRole, value)
  }
}
