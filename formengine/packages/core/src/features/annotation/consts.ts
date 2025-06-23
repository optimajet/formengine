import type {AnnotationType} from './types'
import type {Annotation} from './types/annotations/Annotation'
import {ContainerAnnotation} from './types/annotations/ContainerAnnotation'
import {EventAnnotation} from './types/annotations/EventAnnotation'
import {ModuleAnnotation} from './types/annotations/ModuleAnnotation'
import {PropertyAnnotation} from './types/annotations/PropertyAnnotation'
import {StyleAnnotation} from './types/annotations/StyleAnnotation'

/**
 * The string format for a value of the Time type.
 */
export const timeFormat = 'HH:mm:ss'

export const AnnotationMap: Record<AnnotationType, typeof Annotation> = {
  Property: PropertyAnnotation,
  Container: ContainerAnnotation,
  Event: EventAnnotation,
  Module: ModuleAnnotation,
  Style: StyleAnnotation,
}
