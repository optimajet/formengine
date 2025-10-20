import {array, define, oneOf, useComponentData} from '@react-form-builder/core'
import type {ElementType, SyntheticEvent} from 'react'
import {useCallback} from 'react'
import type {NavProps} from 'rsuite'
import {Nav} from 'rsuite'
import {navProps} from '../commonProperties'
import {staticCategory} from './categories'
import {InputCell} from './components/InputCell'

/**
 * Menu item for RsMenu component.
 */
export type MenuItem = {
  /**
   * The href for the menu item.
   */
  href?: string
  /**
   * The title for the menu item.
   */
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

/**
 * Props for the RsMenu component.
 */
export interface RsMenuProps extends NavProps {
  /**
   * The items for the menu.
   */
  items?: MenuItem[],
  /**
   * The element type for menu items.
   */
  itemsAs: ElementType
}

/**
 * Menu component with navigation support.
 * @param props the component props.
 * @param props.onSelect the callback when menu item is selected.
 * @param props.items the items for the menu.
 * @param props.itemsAs the element type for menu items.
 * @param props.props the additional menu props.
 * @returns the React element.
 */
const RsMenu = ({onSelect, items, itemsAs, ...props}: RsMenuProps) => {
  const componentData = useComponentData()

  const onNavSelect: NavProps['onSelect'] = useCallback((eventKey: any, event: SyntheticEvent) => {
    componentData.userDefinedProps ??= {}
    componentData.userDefinedProps.activeKey = eventKey
    onSelect?.(eventKey, event)
  }, [componentData, onSelect])

  if (!items?.length) return null

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
] as const

const {activeKey, ...props} = navProps

const tags = [...suitableReactElementTypes]

export const rsMenu = define(RsMenu, 'RsMenu')
  .name('Menu')
  .category(staticCategory)
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

