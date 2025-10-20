import type {ReactNode} from 'react'
import {cloneDeep, startCase} from '../../../../utils/tools'
import {AnnotationMap} from '../../consts'
import type {AnnotationType} from '../../types'
import type {Annotation} from '../../types/annotations/Annotation'

/**
 * Options for building an annotation.
 */
export class BuilderOptions {
  /**
   * Type of component property description in the form builder.
   */
  annotationType: AnnotationType = 'Module'
  /**
   * Flag if true, the property name will be automatically converted in the designer from a camel case string to a human-readable string.
   */
  autoName = true
}

/**
 * Type for component property metadata without the 'key' property, but with the 'editor' property.
 */
export type PreAnnotation = Partial<Omit<Annotation, 'key'>> & Pick<Annotation, 'editor'>

/**
 * The type representing custom options for the component's property metadata builder.
 */
export type BuilderSetup = Partial<PreAnnotation & BuilderOptions>

/**
 * The base builder class to define the metadata property of the form builder component.
 * @template T the property type.
 */
export class BaseBuilder<T> {
  /**
   * Partial metadata for a component property.
   */
  annotation!: PreAnnotation
  /**
   * Options for building an annotation.
   */
  options = new BuilderOptions()

  /**
   * @returns the main component property that is used as form data and for validation rules.
   */
  get valued() {
    return this.setup({valued: true, dataBindingType: 'twoWay'})
  }

  /**
   * @returns the main property of the component that uses the form data as data (one-way data binding).
   */
  get dataBound() {
    return this.setup({valued: true, dataBindingType: 'oneWay'})
  }

  /**
   * Sets the value for the property that prevents uncontrolled state.
   * @param uncontrolledValue the value for the uncontrolled state.
   * @returns the modified instance of the builder.
   */
  uncontrolledValue(uncontrolledValue: unknown) {
    return this.setup({uncontrolledValue})
  }

  /**
   * @returns the component property that can be localized.
   */
  get localize() {
    return this.setup({localizable: true})
  }

  /**
   * @returns the non-localizable component property.
   */
  get notLocalize() {
    return this.setup({localizable: false})
  }

  /**
   * Specifies the name of the component property.
   * @param name the property name.
   * @returns the modified instance of the builder.
   */
  named(name: string) {
    return this.setup({name})
  }

  /**
   * Adds the hint to the property name of the component.
   * @param hint the hint.
   * @returns the modified instance of the builder.
   */
  hinted(hint: ReactNode) {
    return this.setup({hint})
  }

  /**
   * Marks the component property as calculable.
   * @param calculable true if the property is calculable.
   * @returns the modified instance of the builder.
   */
  calculable(calculable: boolean) {
    return this.setup({calculable})
  }

  /**
   * Modifies the component property metadata builder with custom options.
   * @param options the custom options.
   * @returns the modified instance of the builder.
   */
  setup(options: BuilderSetup): this {
    const {annotationType, autoName, ...annotation} = options
    const clone = this.clone()
    clone.options.annotationType = annotationType ?? clone.options.annotationType
    clone.options.autoName = autoName ?? clone.options.autoName
    Object.assign(clone.annotation, annotation)
    return clone
  }

  /**
   * Clones the instance of the builder.
   * @returns the cloned instance of the builder.
   */
  clone(): this {
    const copy = cloneDeep(this)

    copy.annotation ??= {} as PreAnnotation
    return copy
  }

  /**
   * Creates component property metadata for the form builder.
   * @param key the unique key of the component property.
   * @returns the instance of the component property metadata for the form builder.
   */
  build(key: string): Annotation {
    const name = this.getName(key)
    const annotation = new AnnotationMap[this.options.annotationType](key, name)
    Object.assign(annotation, this.annotation)
    return annotation
  }

  /**
   * Sets custom properties for the component's property editor.
   * @param props the custom properties
   * @returns the modified instance of the builder.
   */
  withEditorProps(props: any): this {
    const clone = this.clone()
    Object.assign(clone.annotation, {editorProps: props})
    return clone
  }

  /**
   * Hides the component property editor.
   * @returns the modified instance of the builder.
   */
  hideEditor(): this {
    const clone = this.clone()
    Object.assign(clone.annotation, {editor: undefined})
    return clone
  }

  /**
   * Returns the annotation name.
   * @param key the property name
   * @returns the annotation name.
   */
  protected getName(key: string) {
    return this.annotation.name ?? (this.options.autoName ? startCase(key) : key)
  }
}
