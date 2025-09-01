import {internalErrorMeta} from '../../components/internalErrorMeta'
import {screenMeta} from '../../components/screenMeta'
import {modalMeta} from '../../modal/modalMeta'
import {modalModel} from '../../modal/modalModel'
import {repeaterMeta} from '../../repeater/repeaterMeta'
import {repeaterModel} from '../../repeater/repeaterModel'
import {createTemplateMeta, createTemplateModel, slotMeta, slotModel} from '../../template'
import {internalErrorModel} from '../../ui/internalErrorModel'
import {screenModel} from '../../ui/screenModel'
import {errorMessageModel} from '../../validation/components/DefaultErrorMessage'
import {errorMessageMeta} from '../../validation/errorMessageMeta'
import type {BuilderComponent} from './BuilderComponent'
import type {Meta} from './Meta'
import {View} from './View'

const templatesCategoryName = 'templates'
const structureCategoryName = 'structure'
const modalCategoryName = 'modal'

/**
 * Represents all the metadata of the form builder components.
 */
export class BuilderView extends View {
  #metaMap = new Map<string, Meta>()

  /**
   * The function for filtering components on the component palette.
   */
  paletteFilter?: (builderComponent: BuilderComponent) => boolean

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
   * Sets a function for filtering components on the component palette.
   * @param filter the component filtering function.
   * @returns the instance of the {@link BuilderView} class.
   */
  withPaletteFilter(filter: (builderComponent: BuilderComponent) => boolean): this {
    this.paletteFilter = filter
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
    this.builderComponents.push({meta: screenMeta, model: screenModel})
    this.builderComponents.push({meta: internalErrorMeta, model: internalErrorModel})
    this.builderComponents.push({meta: slotMeta, model: slotModel, category: templatesCategoryName})
    this.builderComponents.push({meta: repeaterMeta, model: repeaterModel, category: structureCategoryName})
    this.builderComponents.push({meta: errorMessageMeta, model: errorMessageModel})
    this.builderComponents.push({meta: modalMeta, model: modalModel, category: modalCategoryName})

    const metas = builderComponents.map(({meta}) => meta)

    metas.forEach(meta => {
      this.#metaMap.set(meta.type, meta)
    })
  }
}
