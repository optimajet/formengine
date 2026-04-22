import type {CSSProperties} from 'react'
import type {CssPart} from '../features/style/types'

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
   * Apply styles to the document.
   * @param cssPart the CSS part to apply.
   * @param flatCss the flattened CSS.
   */
  applyStyles(cssPart: CssPart, flatCss: string): void

  /**
   * @returns the flattened CSS for the component.
   */
  get flatCss(): string

  /**
   * @returns the flattened CSS for the component wrapper.
   */
  get flatWrapperCss(): string

  /**
   * @returns true if the component is read-only, false otherwise.
   */
  get isReadOnly(): boolean

  /**
   * @returns true if the component is disabled, false otherwise.
   */
  get isDisabled(): boolean

  /**
   * Sets the object associated with this component in the viewer.
   * @param object the object associated with this component in the viewer.
   */
  setRef?: (object: any) => void

  /**
   * @returns the object associated with this component in the viewer.
   */
  getRefValue?: () => any
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
  /*
  * @inheritDoc
  */
  applyStyles(_cssPart: CssPart, _flatCss: string): void {
  },
  /**
   * @inheritDoc
   */
  get flatCss() {
    return ''
  },
  /**
   * @inheritDoc
   */
  get flatWrapperCss() {
    return ''
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
