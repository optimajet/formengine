import {BiDi} from '../../localization/bidi'
import {modalModel} from '../../modal/modalModel'
import {repeaterItemModel} from '../../repeater/RepeaterItem'
import {repeaterModel} from '../../repeater/repeaterModel'
import {embeddedFormModel} from '../../template/embeddedFormModel'
import {fragmentModel} from '../../template/fragmentModel'
import {slotModel} from '../../template/slotModel'
import {templateModel} from '../../template/templateModel'
import {internalErrorModel} from '../../ui/internalErrorModel'
import {screenModel} from '../../ui/screenModel'
import {errorMessageModel} from '../../validation/components/DefaultErrorMessage'
import type {FormViewerWrapper} from './FormViewerWrapperComponentProps'
import type {IView} from './IView'
import type {Model} from './Model'

/**
 * Represents the type of CSS loader. Can be either BiDi or common for both BiDi.
 */
export type CssLoaderType = BiDi | 'common'

/**
 * Represents all the metadata of the form viewer components.
 */
export class View implements IView {
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
    this.define(embeddedFormModel)
    this.define(templateModel)
    this.define(fragmentModel)
    this.define(repeaterModel)
    this.define(repeaterItemModel)
    this.define(errorMessageModel)
    this.define(modalModel)
    models.forEach(this.define.bind(this))
  }

  /**
   * @inheritDoc
   */
  define(model: Model) {
    this.#modelMap.set(model.type, model)
  }

  /**
   * @inheritDoc
   */
  get(type: string) {
    const result = this.find(type)
    if (result) return result
    throw new Error(`Type '${type}' is not found!`)
  }

  /**
   * @inheritDoc
   */
  find(type: string) {
    return this.#modelMap.get(type)
  }

  /**
   * @inheritDoc
   */
  all() {
    return [...this.#modelMap.values()]
  }

  /**
   * @inheritDoc
   */
  filterModels(predicate: (model: Model) => boolean) {
    return [...this.#modelMap.values()]
      .filter(predicate)
  }

  /**
   * @inheritDoc
   */
  withViewerWrapper = (wrapper: FormViewerWrapper) => {
    this.#wrappers.push(wrapper)
    return this
  }

  /**
   * @inheritDoc
   */
  get viewerWrappers() {
    return [...this.#wrappers]
  }

  /**
   * @inheritDoc
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
   * @inheritDoc
   */
  getCssLoaders(biDi: BiDi) {
    return this.#cssLoaders.get(biDi) ?? []
  }
}

export const createView = View.create
