import {array, define, event, oneOf, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import type {BreadcrumbProps} from 'rsuite'
import {Breadcrumb} from 'rsuite'
import {nonNegNumber} from '../commonProperties'
import {CheckCell} from './components/CheckCell'
import {InputCell} from './components/InputCell'

interface RsBreadcrumbItemProps {
  active?: boolean
  href?: string
  title?: string
}

const makeItems = (data: string[]) => data.map(title => ({title, href: title}))

interface RsBreadcrumbProps extends BreadcrumbProps {
  items: RsBreadcrumbItemProps[]
  onItemClick: (item: RsBreadcrumbItemProps) => {}
}

const columns = [
  {name: 'title', input: InputCell},
  {name: 'href', title: 'Url', input: InputCell},
  {name: 'active', input: CheckCell}
] as const

const containerStyle = {display: 'flex'} as const

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
