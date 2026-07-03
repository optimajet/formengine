import type {ReactNode} from 'react'
import {createNodeAnnotation} from './utils/builders/NodeAnnotationBuilder'

/**
 * The annotation builder for a component property with type 'ReactNode'/'string'.
 */
export const stringNode = createNodeAnnotation<ReactNode>('node')
  .setup({annotationType: 'Container'})
  .withDefaultEditor('string')
