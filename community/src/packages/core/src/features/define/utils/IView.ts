import type {BiDi} from '../../localization/bidi'
import type {FormViewerWrapper} from './FormViewerWrapperComponentProps'
import type {Model} from './Model'
import type {CssLoaderType} from './View'

/**
 * Represents all the metadata of the form viewer components.
 */
export interface IView {

  /**
   * Defines the component's metadata for the form viewer.
   * @param model the component's metadata.
   */
  define: (model: Model) => void

  /**
   * Returns the component's metadata for the form viewer for the specified type.
   * @param type the component type.
   * @returns the component metadata for the form viewer for the specified type.
   */
  get: (type: string) => Model

  /**
   * Returns the component's metadata for the form viewer for the specified type.
   * @param type the component type.
   * @returns the component metadata for the form viewer for the specified type or undefined.
   */
  find: (type: string) => Model | undefined

  /**
   * @returns all component metadata for the form viewer.
   */
  all: () => Model[]

  /**
   * Returns the array of component metadata filtered using the predicate function.
   * @param predicate the filter function.
   * @returns the array of component metadata filtered using the predicate function.
   */
  filterModels: (predicate: (model: Model) => boolean) => Model[]

  /**
   * Adds a wrapper to the list of viewers for this viewer wrapper.
   * @param wrapper  the viewer wrapper to be added. The wrapper is a component that wraps the form viewer.
   * @returns the {@link View} instance.
   */
  withViewerWrapper: (wrapper: FormViewerWrapper) => this

  /**
   * Retrieves the viewer wrappers array.
   * @returns the viewer wrappers array.
   */
  readonly viewerWrappers: FormViewerWrapper[]

  /**
   * Applies the given CSS loader to the component based on the BiDi layout.
   * @param cssLoaderType the BiDi layout type, either 'common', 'ltr', or 'rtl'.
   * @param loader the function that returns a Promise to load CSS or other required localization resources.
   * @returns the {@link View} instance.
   */
  withCssLoader: (cssLoaderType: CssLoaderType, loader: () => Promise<void>) => this

  /**
   * Retrieves the CSS loaders for a given BiDi.
   * @param biDi the BiDi object for which to retrieve the CSS loaders.
   * @returns the array containing the CSS loaders for the specified BiDi.
   */
  getCssLoaders: (biDi: BiDi) => Array<() => Promise<void>>
}
