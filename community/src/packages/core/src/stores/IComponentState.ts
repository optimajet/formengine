import type {CSSProperties} from 'react'

/**
 * Calculates all the properties of the form view component.
 */
export interface IComponentState {
  /**
   * @returns combined in order of priority component properties.
   */
  get get(): Record<string, any>

  /**
   * Calculates and returns wrapper className property.
   * @returns the className for the wrapper of component.
   */
  get wrapperClassName(): string

  /**
   * @returns the Record that contains the style property for the wrapper of component.
   */
  get wrapperStyle(): { style: CSSProperties } | undefined

  /**
   * @returns combined component properties in order of priority, excluding child components, the className property
   * does not contain styles additionally defined for the component.
   */
  get propsWithoutChildren(): Record<string, any>

  /**
   * @returns combined in order of priority component properties without children props.
   */
  get ownProps(): Record<string, any>

  /**
   * The method that is called when the component is mounted.
   */
  onDidMount(): void

  /**
   * The method that is called when the component is unmounted.
   */
  onWillUnmount(): void

  /**
   * @returns true if the component has a read-only property and this property is true, false otherwise.
   */
  get isReadOnly(): boolean

  /**
   * @returns true if the component has a disabled property and this property is true, false otherwise.
   */
  get isDisabled(): boolean
}

/**
 * The default component state, which does nothing.
 */
export const defaultComponentState: IComponentState = {
  /**
   * @inheritDoc
   */
  get get() {
    return {}
  },
  /**
   * @inheritDoc
   */
  get wrapperClassName() {
    return ''
  },
  /**
   * @inheritDoc
   */
  get wrapperStyle() {
    return undefined
  },
  /**
   * @inheritDoc
   */
  get propsWithoutChildren() {
    return {}
  },
  /**
   * @inheritDoc
   */
  get ownProps() {
    return {}
  },
  /**
   * @inheritDoc
   */
  onDidMount(): void {
  },
  /**
   * @inheritDoc
   */
  onWillUnmount(): void {
  },
  /**
   * @inheritDoc
   */
  get isReadOnly() {
    return false
  },
  /**
   * @inheritDoc
   */
  get isDisabled() {
    return false
  }
}
