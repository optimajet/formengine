import type {Annotation} from '../../annotation/types/annotations/Annotation'
import {internalErrorMeta} from '../../components/internalErrorMeta'
import {screenMeta} from '../../components/screenMeta'
import {repeaterMeta} from '../../repeater/repeaterMeta'
import {repeaterModel} from '../../repeater/repeaterModel'
import {createTemplateMeta, createTemplateModel, slotMeta, slotModel} from '../../template'
import {errorMessageMeta} from '../../validation/errorMessageMeta'
import type {BuilderComponent} from './BuilderComponent'
import type {Meta} from './Meta'
import {View} from './View'

const templatesCategoryName = 'templates'
const structureCategoryName = 'structure'

/**
 * Represents all the metadata of the form builder components.
 */
export class BuilderView extends View {
  #metaMap = new Map<string, Meta>()
  #tooltipsMeta = new Map<string, Meta>()
  #errorMeta = new Map<string, Meta>([
    [errorMessageMeta.type, errorMessageMeta],
  ])

  /**
   * Returns the component metadata for the specified component type name.
   * @param type the component type name.
   * @returns the component metadata for the specified component type name.
   */
  getMeta(type: string) {
    const result = this.#metaMap.get(type)
    if (result) return result
    return internalErrorMeta
  }

  /**
   * Adds the component metadata to the form builder.
   * @param component the component metadata.
   */
  addComponent(component: BuilderComponent) {
    this.define(component.model)
    this.#metaMap.set(component.meta.type, component.meta)
  }

  /**
   * Removes the component metadata from the form builder.
   * @param name the component type name.
   */
  removeComponent(name: string) {
    this.#metaMap.delete(name)
  }

  /**
   * Returns the component metadata for the specified component type name or undefined.
   * @param type the component type name.
   * @returns the component metadata for the specified component type name or undefined.
   */
  findMeta(type: string) {
    return this.#metaMap.get(type)
  }

  /**
   * Returns the array of metadata properties of the tooltip component.
   * @param name the name of the tooltip component type.
   * @returns the array of metadata properties of the tooltip component.
   */
  getTooltipAnnotations(name: string): Annotation[] | undefined {
    return this.#tooltipsMeta.get(name)?.properties
  }

  /**
   * Returns the array of metadata properties of the error component.
   * @param name the name of the error component type.
   * @returns the array of metadata properties of the error component.
   */
  getErrorAnnotations(name: string): Annotation[] | undefined {
    return this.#errorMeta.get(name)?.properties
  }

  /**
   * @returns the array of strings with the names of the component types of the tooltip.
   */
  get tooltips() {
    return Array.from(this.#tooltipsMeta.keys())
  }

  /**
   * @returns the array of strings with the names of the component types of the error.
   */
  get errors() {
    return Array.from(this.#errorMeta.keys())
  }

  /**
   * Sets the metadata of the component that displays the form's tooltips.
   * @param builderComponent the metadata of the component that displays the form's tooltips.
   * @returns the instance of the {@link BuilderView} class.
   */
  withTooltipMeta(builderComponent: BuilderComponent): this {
    const {model, meta} = builderComponent
    this.define(model)
    this.#tooltipsMeta.set(model.type, meta)
    return this
  }

  /**
   * Sets the metadata of the component that displays form's errors.
   * @param builderComponent the metadata of the component that displays the form's errors.
   * @returns the instance of the {@link BuilderView} class.
   */
  withErrorMeta(builderComponent: BuilderComponent): this {
    const {model, meta} = builderComponent
    this.define(model)
    this.#errorMeta.set(model.type, meta)
    return this
  }

  /**
   * Creates metadata for the form builder for templates from the specified template names.
   * @param templates the array of template names.
   * @returns the instance of the {@link BuilderView} class.
   */
  withTemplates(templates: string[]): this {
    templates.forEach(name => {
      const builderComponent = BuilderView.createTemplateComponent(name)
      this.define(builderComponent.model)
      this.#metaMap.set(builderComponent.meta.type, builderComponent.meta)
      this.builderComponents.push(builderComponent)
    })
    return this
  }

  /**
   * Creates an instance of BuilderComponent for the specified template name.
   * @param name the template name
   * @returns the BuilderComponent instance.
   */
  static createTemplateComponent(name: string): BuilderComponent {
    const model = createTemplateModel(name)
    const meta = createTemplateMeta(name)
    return {meta, model, category: templatesCategoryName}
  }

  /**
   * Creates metadata for form builder components.
   * @param builderComponents the array of metadata of form builder components.
   */
  constructor(public builderComponents: BuilderComponent[]) {
    super(builderComponents.map(({model}) => model))
    this.#metaMap.set(screenMeta.type, screenMeta)
    this.#metaMap.set(internalErrorMeta.type, internalErrorMeta)
    this.builderComponents.push({meta: slotMeta, model: slotModel, category: templatesCategoryName})
    this.builderComponents.push({meta: repeaterMeta, model: repeaterModel, category: structureCategoryName})

    const metas = builderComponents.map(({meta}) => meta)

    metas.forEach(meta => {
      this.#metaMap.set(meta.type, meta)
    })
  }
}
