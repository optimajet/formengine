import type {ComponentType, ReactNode} from 'react'
import {BiDi} from '../../localization/bidi'
import type {Language} from '../../localization/types'
import {modalModel} from '../../modal/modalModel'
import {repeaterItemModel} from '../../repeater/RepeaterItem'
import {repeaterModel} from '../../repeater/repeaterModel'
import {slotModel} from '../../template'
import {fragmentModel} from '../../template/fragmentModel'
import {internalErrorModel} from '../../ui/internalErrorModel'
import {screenModel} from '../../ui/screenModel'
import {errorMessageModel} from '../../validation/components/DefaultErrorMessage'
import type {Model} from './Model'

/**
 * Represents the type of CSS loader. Can be either BiDi or common for both BiDi.
 */
export type CssLoaderType = BiDi | 'common'

/**
 * Represents a form viewer Wrapper component.
 */
export type FormViewerWrapper = ComponentType<FormViewerWrapperComponentProps>

/**
 * Represents the props for the WrapperComponent. WrapperComponent is a component that wraps the form viewer. Can be added externally.
 */
export interface FormViewerWrapperComponentProps {
  /**
   * The FormViewer language.
   */
  language: Language
  /**
   * The React child node.
   */
  children: ReactNode
}

/**
 * Represents all the metadata of the form viewer components.
 */
export class View {
  #modelMap = new Map<string, Model>()
  #cssLoaders = new Map<BiDi, Array<() => Promise<void>>>
  #wrappers = new Array<FormViewerWrapper>()

  /**
   * Static wrapper for the {@link View} constructor.
   * @param models the components metadata.
   * @returns the {@link View} instance.
   */
  static create(models: Model[]) {
    return new View(models)
  }

  /**
   * Creates an instance of the {@link View}.
   * @param models the components metadata.
   */
  constructor(models: Model[] = []) {
    this.define(screenModel)
    this.define(internalErrorModel)
    this.define(slotModel)
    this.define(fragmentModel)
    this.define(repeaterModel)
    this.define(repeaterItemModel)
    this.define(errorMessageModel)
    this.define(modalModel)
    models.forEach(this.define.bind(this))
  }

  /**
   * Defines the component's metadata for the form viewer.
   * @param model the component's metadata.
   */
  define(model: Model) {
    this.#modelMap.set(model.type, model)
  }

  /**
   * Returns the component's metadata for the form viewer for the specified type.
   * @param type the component type.
   * @returns the component metadata for the form viewer for the specified type.
   */
  get(type: string) {
    const result = this.find(type)
    if (result) return result
    throw new Error(`Type '${type}' is not found!`)
  }

  /**
   * Returns the component's metadata for the form viewer for the specified type.
   * @param type the component type.
   * @returns the component metadata for the form viewer for the specified type or undefined.
   */
  find(type: string) {
    return this.#modelMap.get(type)
  }

  /**
   * @returns all component metadata for the form viewer.
   */
  all() {
    return [...this.#modelMap.values()]
  }

  /**
   * Returns the array of component metadata filtered using the predicate function.
   * @param predicate the filter function.
   * @returns the array of component metadata filtered using the predicate function.
   */
  filterModels(predicate: (model: Model) => boolean) {
    return [...this.#modelMap.values()]
      .filter(predicate)
  }

  /**
   * Adds a wrapper to the list of viewers for this viewer wrapper.
   * @param wrapper  the viewer wrapper to be added. The wrapper is a component that wraps the form viewer.
   * @returns the {@link View} instance.
   */
  withViewerWrapper = (wrapper: FormViewerWrapper) => {
    this.#wrappers.push(wrapper)
    return this
  }

  /**
   * Retrieves the viewer wrappers array.
   * @returns the viewer wrappers array.
   */
  get viewerWrappers() {
    return [...this.#wrappers]
  }

  /**
   * Applies the given CSS loader to the component based on the BiDi layout.
   * @param cssLoaderType the BiDi layout type, either 'common', 'ltr', or 'rtl'.
   * @param loader the function that returns a Promise to load CSS or other required localization resources.
   * @returns the {@link View} instance.
   */
  withCssLoader(cssLoaderType: CssLoaderType, loader: () => Promise<void>) {
    if (cssLoaderType === 'common') {
      this.#withCssLoader(BiDi.LTR, loader)
      this.#withCssLoader(BiDi.RTL, loader)
    } else {
      this.#withCssLoader(cssLoaderType, loader)
    }
    return this
  }

  /**
   * Sets a CSS loader for the specified BiDi direction.
   * @param biDi the BiDi direction.
   * @param loader the loader function that returns a Promise.
   */
  #withCssLoader(biDi: BiDi, loader: () => Promise<void>) {
    this.#cssLoaders.set(biDi, [...(this.#cssLoaders.get(biDi) ?? []), loader])
  }

  /**
   * Retrieves the CSS loaders for a given BiDi.
   * @param biDi the BiDi object for which to retrieve the CSS loaders.
   * @returns the array containing the CSS loaders for the specified BiDi.
   */
  getCssLoaders(biDi: BiDi) {
    return this.#cssLoaders.get(biDi) ?? []
  }
}

export const createView = View.create
