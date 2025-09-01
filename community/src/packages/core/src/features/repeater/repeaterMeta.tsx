import type {Annotation} from '../annotation/types/annotations/Annotation'
import {modules} from '../define/constants'
import {Meta} from '../define/utils/Meta'
import {
  repeaterModel,
  repeaterProps,
  repeaterItemStyleProperties,
  repeaterValuedAnnotation,
  repeaterWrapperStyleProperties
} from './repeaterModel'

export const repeaterModules: Annotation[] = [
  ...modules,
]

export const repeaterMeta = new Meta(repeaterModel.type, repeaterProps, repeaterItemStyleProperties, repeaterWrapperStyleProperties,
  repeaterModules, undefined, repeaterValuedAnnotation.build('value'))
