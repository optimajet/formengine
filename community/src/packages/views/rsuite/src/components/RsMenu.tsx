import {array, define, oneOf, useComponentData} from '@react-form-builder/core'
import type {ElementType} from 'react'
import type {NavProps} from 'rsuite'
import {Nav} from 'rsuite'
import {navProps} from '../commonProperties'
import {InputCell} from './components/InputCell'

type MenuItem = {
  href?: string
  title?: string
}

const makeItems = (data: string[]) => data.map(title => ({title, href: `#${title}`}))

const suitableReactElementTypes = new Set([
  'a',
  'button',
  'div',
  'span',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'b',
  'em',
  'i',
  'q',
  's',
  'u',
  'input',
  'label',
  'section',
  'article',
  'nav',
  'pre'
])

interface RsMenuProps extends NavProps {
  items?: MenuItem[],
  itemsAs: ElementType
}

const RsMenu = ({onSelect, items, itemsAs, ...props}: RsMenuProps) => {
  const componentData = useComponentData()
  if (!items?.length) return null

  const onNavSelect: NavProps['onSelect'] = (eventKey, event) => {
    componentData.userDefinedProps ??= {}
    componentData.userDefinedProps.activeKey = eventKey
    onSelect?.(eventKey, event)
  }

  return <Nav onSelect={onNavSelect} {...props}>
    {items.map(({title, href}, index) =>
      <Nav.Item key={index} href={href} as={itemsAs} eventKey={title} active={title === props.activeKey}>
        {title}
      </Nav.Item>)
    }
  </Nav>
}

const columns = [
  {name: 'title', input: InputCell},
  {name: 'href', title: 'Url', input: InputCell}
]

const {activeKey, ...props} = navProps

const tags = Array.from(suitableReactElementTypes)

export const rsMenu = define(RsMenu, 'RsMenu')
  .name('Menu')
  .props({
    activeKey: activeKey.default('Home'),
    ...props,
    itemsAs: oneOf(...tags)
      .labeled(...tags)
      .default('a')
      .withEditorProps({creatable: false}),
    items: array
      .default(makeItems(['Home', 'News', 'Products']))
      .withEditorProps({columns}),
  })

