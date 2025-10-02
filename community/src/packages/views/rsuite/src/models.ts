import {rSuiteComponents} from './rSuiteComponents'

export const components = rSuiteComponents.map(def => def.build())

/**
 * An array of rSuite component metadata for use in FormViewer.
 */
export const models = components.map(({model}) => model)
