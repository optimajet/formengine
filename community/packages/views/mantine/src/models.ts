import type {Model} from '@react-form-builder/core'
import {builderComponents} from './builderComponents'

/**
 * An array of Mantine component metadata for use in FormViewer.
 */
export const models: Model[] = builderComponents.map(({model}) => model)
