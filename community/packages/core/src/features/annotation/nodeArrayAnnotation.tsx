import type {ReactNode} from 'react'
import {createNodeAnnotation} from './utils/builders/NodeAnnotationBuilder'

/**
 * The annotation builder for a component property with type 'ReactNode[]'.
 */
export const nodeArray = createNodeAnnotation<ReactNode[]>('nodeArray')
  .setup({annotationType: 'Container', bindingType: 'array'})
