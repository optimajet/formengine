import {event} from '../annotation/eventAnnotation'
import {htmlAttributes} from '../annotation/htmlAttributesAnnotation'
import {renderWhen} from '../annotation/renderWhenAnnotation'
import {tooltipProps} from '../annotation/tooltipPropsAnnotation'
import type {Annotation} from '../annotation/types/annotations/Annotation'
import {validation} from '../annotation/validationAnnotation'
import {DidMountEvent, WillUnmountEvent} from '../event/eventNames'

/**
 * Common metadata for the component for the form builder.
 */
export const modules: Annotation[] = [
  tooltipProps.build('tooltipProps'),
  renderWhen.build('renderWhen'),
  htmlAttributes.build('htmlAttributes'),
  validation.build('validation'),
  event.build(DidMountEvent),
  event.build(WillUnmountEvent),
]
