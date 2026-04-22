import * as rSuiteComponents from '@react-form-builder/components-rsuite'
import {viewWithCss} from '@react-form-builder/components-rsuite'
import type {FormViewerProps} from '@react-form-builder/core'
import {FormViewer} from '@react-form-builder/core'
import {createElement} from 'react'
// eslint-disable-next-line import/extensions
import {createRoot} from 'react-dom/client'

/**
 * Displays the FormViewer component on the specified HTML element.
 * @param container the HTML element.
 * @param props the component properties.
 * @returns React Root.
 */
export function renderFormViewerTo(container: HTMLElement, props: Partial<FormViewerProps>) {
  const root = createRoot(container)

  const formViewerProps: FormViewerProps = {
    ...props,
    view: props.view ?? viewWithCss,
  }

  root.render(createElement(FormViewer, formViewerProps, null))
  return root
}

/**
 * Displays the FormViewer component on the specified HTML element.
 * @param elementId the HTML element identifier.
 * @param props the component properties.
 * @returns React Root.
 */
export function renderFormViewer(elementId: string, props: Partial<FormViewerProps>) {
  const container = document.getElementById(elementId)
  if (!container) throw new Error(`Cannot find element with id '${elementId}'`)
  return renderFormViewerTo(container, props)
}

export {rSuiteComponents}
export {ActionDefinition, createView, buildForm, Language} from '@react-form-builder/core'
