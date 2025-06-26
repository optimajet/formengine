import {event, htmlAttributes, renderWhen, tooltipProps, validation} from '../annotation'
import type {Annotation} from '../annotation/types/annotations/Annotation'
import {DidMountEvent, WillUnmountEvent} from '../event'

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
