import type {Annotation} from '../annotation/types/annotations/Annotation'
import {modules} from '../define/constants'
import {Meta} from '../define/utils/Meta'
import {
  repeaterItemStyleProperties,
  repeaterModel,
  repeaterProps,
  repeaterValuedAnnotation,
  repeaterWrapperStyleProperties
} from './repeaterModel'

const repeaterModules: Annotation[] = [
  ...modules,
]

export const repeaterMeta = new Meta(repeaterModel.type, repeaterProps, repeaterItemStyleProperties, repeaterWrapperStyleProperties,
  repeaterModules, repeaterValuedAnnotation.build('value'))
