import styled from '@emotion/styled'
import {array, boolean, define, node, toLabeledValues, useComponentData} from '@react-form-builder/core'
import type {ReactNode, SyntheticEvent} from 'react'
import {useCallback} from 'react'
import type {NavProps} from 'rsuite'
import {Nav} from 'rsuite'
import {navProps} from '../commonProperties'
import {structureCategory} from './categories'

/**
 * Tab item for RsTab component.
 */
export type RsTabItem = {
  /**
   * Label for the tab item.
   */
  label: string
  /**
   * Value for the tab item.
   */
  value: string
}

/**
 * Props for the RsTab component.
 */
export interface RsTabProps extends NavProps {
  /**
   * Items for the tab.
   */
  items?: RsTabItem[]
  /**
   * Whether to show navigation.
   */
  showNavigation?: boolean
  /**
   * Pane content for the tab.
   */
  pane: ReactNode
}

const STabs = styled(Nav)({
  '.builder & .rs-nav-item': {
    zIndex: 7,
  },
  '.rs-nav-item': {
    border: 'none',
    outline: 'none',
    appearance: 'none',
    backgroundColor: 'transparent'
  }
})

/**
 * Tab component with navigation and pane support.
 * @param props the component props.
 * @param props.pane the pane content for the tab.
 * @param props.onSelect the callback when tab is selected.
 * @param props.showNavigation whether to show navigation.
 * @param props.items the items for the tab.
 * @param props.props the additional tab props.
 * @returns the React element.
 */
const RsTab = ({
                 pane,
                 onSelect,
                 showNavigation,
                 items,
                 ...props
               }: RsTabProps) => {
  const componentData = useComponentData()

  const onNavSelect = useCallback((eventKey: string, event: SyntheticEvent) => {
    componentData.userDefinedProps ??= {}
    componentData.userDefinedProps.activeKey = eventKey
    onSelect?.(eventKey, event)
  }, [componentData, onSelect])

  if (!items?.length) return null

  const activeKey = props.activeKey ?? items?.[0].value

  return <>
    {showNavigation === true &&
      <STabs onSelect={onNavSelect} activeKey={activeKey} {...props}>
        {items.map((item, index) => <Nav.Item key={index}
                                              eventKey={item.value}
                                              role="tab"
                                              as="button"
                                              type="button">
            {item.label}
          </Nav.Item>
        )}
      </STabs>
    }
    <div>{pane}</div>
  </>
}

export const rsTab = define(RsTab, 'RsTab')
  .name('Tab')
  .category(structureCategory)
  .props({
    ...navProps,
    items: array.default(toLabeledValues(['Item1', 'Item2', 'Item3'])),
    showNavigation: boolean.hinted('Show or hide navigation').default(true),
    pane: node
      .withSlotConditionBuilder(props => `return parentProps.activeKey === '${props.activeKey?.value ?? props.activeKey}'`)
      .calculable(false).hinted('A child component of the tab'),
  })
