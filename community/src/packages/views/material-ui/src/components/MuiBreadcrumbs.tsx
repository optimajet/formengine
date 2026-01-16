import type {BreadcrumbsProps} from '@mui/material'
import {Breadcrumbs, Link, Typography} from '@mui/material'
import type {SxProps} from '@mui/system'
import {array, define, event, nonNegNumber, number, string} from '@react-form-builder/core'
import {useCallback, useMemo} from 'react'
import {navigationCategory} from './categories'

/**
 * Settings for a single breadcrumb item.
 */
export interface BreadcrumbsItem {
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
 * Props for a single breadcrumb item component.
 */
export interface MuiBreadcrumbsItemProps extends BreadcrumbsItem {
  /**
   * Callback function when the breadcrumb item is clicked.
   */
  onClick?: (item: BreadcrumbsItem) => void
}

/**
 * Props for the MuiBreadcrumbs component.
 */
export interface MuiBreadcrumbsProps extends BreadcrumbsProps {
  /**
   * Array of breadcrumb items to display.
   */
  items: BreadcrumbsItem[]
  /**
   * Callback function when a breadcrumb item is clicked.
   */
  onItemClick: (item: MuiBreadcrumbsItemProps) => void
}

/**
 * Styles for active breadcrumb item.
 */
const activeItemSx: SxProps = {
  color: 'text.primary'
}

/**
 * Renders a single breadcrumb item.
 * @param props breadcrumb item properties.
 * @param props.onClick callback function when the breadcrumb item is clicked.
 * @returns the React element.
 */
const BreadcrumbsItem = ({onClick, ...item}: MuiBreadcrumbsItemProps) => {
  const {href, title} = item
  const handleClick = useCallback(() => onClick?.(item), [item, onClick])

  return <Link color="inherit" href={href} onClick={handleClick}>
    {title}
  </Link>
}

/**
 * Material-UI Breadcrumbs component for form builder.
 * @param props component properties.
 * @param props.items array of breadcrumb items to display.
 * @param props.onItemClick callback function when a breadcrumb item is clicked.
 * @returns the React element.
 */
const MuiBreadcrumbs = ({items = [], onItemClick, ...props}: MuiBreadcrumbsProps) => {
  const renderedItems = useMemo(() => items.map((item, i) => {
    if (item.active) {
      return <Typography sx={activeItemSx} key={i}>{item.title}</Typography>
    }
    return <BreadcrumbsItem onClick={onItemClick} {...item} key={i}/>
  }), [items, onItemClick])

  return <Breadcrumbs {...props}>{renderedItems}</Breadcrumbs>
}

const makeItems = (data: string[]) => data.map(title => ({title, href: `/${title}`}))

const columns = [
  {name: 'title'},
  {name: 'href', title: 'Url'},
  {name: 'active', inputName: 'CheckCell'}
] as const

export const muiBreadcrumbs = define(MuiBreadcrumbs, 'MuiBreadcrumbs')
  .icon('Breadcrumb')
  .category(navigationCategory)
  .props({
    separator: string,
    items: array
      .default(makeItems(['one', 'two', 'three']))
      .withEditorProps({columns}),
    onItemClick: event,
    maxItems: nonNegNumber,
    itemsAfterCollapse: number,
    itemsBeforeCollapse: number
  })
