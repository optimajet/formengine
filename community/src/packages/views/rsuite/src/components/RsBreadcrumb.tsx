import {array, define, event, oneOf, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import type {BreadcrumbProps} from 'rsuite'
import {Breadcrumb} from 'rsuite'
import {nonNegNumber} from '../commonProperties'
import {structureCategory} from './categories'
import {CheckCell} from './components/CheckCell'
import {InputCell} from './components/InputCell'

/**
 * Props for a single breadcrumb item.
 */
export interface RsBreadcrumbItemProps {
  /**
   * Whether the breadcrumb item is active.
   */
  active?: boolean
  /**
   * URL for the breadcrumb item.
   */
  href?: string
  /**
   * Title text for the breadcrumb item.
   */
  title?: string
}

/**
 * Creates breadcrumb items from string data.
 * @param data the array of strings to convert to breadcrumb items.
 * @returns the array of breadcrumb items.
 */
const makeItems = (data: string[]) => data.map(title => ({title, href: title}))

/**
 * Props for the RsBreadcrumb component.
 */
export interface RsBreadcrumbProps extends BreadcrumbProps {
  /**
   * Array of breadcrumb items to display.
   */
  items: RsBreadcrumbItemProps[]
  /**
   * Callback function when a breadcrumb item is clicked.
   */
  onItemClick: (item: RsBreadcrumbItemProps) => {}
}

/**
 * Column definitions for breadcrumb item editor.
 */
const columns = [
  {name: 'title', input: InputCell},
  {name: 'href', title: 'Url', input: InputCell},
  {name: 'active', input: CheckCell}
] as const

/**
 * Container style for breadcrumb component.
 */
const containerStyle = {display: 'flex'} as const

/**
 * Breadcrumb component for navigation.
 * @param props the component props.
 * @param props.items - the array of breadcrumb items to display.
 * @param props.onItemClick - the callback function when a breadcrumb item is clicked.
 * @param props.separator the separator between breadcrumb items.
 * @param props.maxItems the maximum number of breadcrumb items to display.
 * @param props.onExpand the callback function when breadcrumb is expanded.
 * @param props.justifyContent the CSS justify-content property for alignment.
 * @returns the React element.
 */
const RsBreadcrumb = ({items, onItemClick, ...props}: RsBreadcrumbProps) => {
  const clickHandlers = useMemo(() => (items ?? []).map((it) => {
    return () => onItemClick?.(it)
  }), [items, onItemClick])

  return (
    <Breadcrumb {...props} style={containerStyle}>
      {items?.map((item, idx) => {
        const {title = '', ...itemProps} = item
        return (
          <Breadcrumb.Item {...itemProps} onClick={clickHandlers[idx]} key={title}>
            {title}
          </Breadcrumb.Item>)
      })}
    </Breadcrumb>
  )
}

export const rsBreadcrumb = define(RsBreadcrumb, 'RsBreadcrumb')
  .name('Breadcrumb')
  .category(structureCategory)
  .props({
    separator: string.default('/'),
    maxItems: nonNegNumber.hinted('Set the maximum number of breadcrumbs to display'),
    items: array
      .default(makeItems(['one', 'two', 'three']))
      .withEditorProps({columns}),
    onItemClick: event,
    onExpand: event
  })
  .css({
    justifyContent: oneOf('left', 'center', 'right')
      .default('left').radio().named('Alignment'),
  })
