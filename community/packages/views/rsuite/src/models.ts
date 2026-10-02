import type {Model} from '@react-form-builder/core'
import {components} from './definitions'

/**
 * An array of rSuite component metadata for use in FormViewer.
 */
export const models: Model[] = components.map(({model}) => model)
