import type {Model} from '@react-form-builder/core'
import {muiBuilderComponents} from './muiComponents'

/**
 * An array of Material UI component metadata for use in FormViewer.
 */
export const models: Model[] = muiBuilderComponents.map(({model}) => model)
