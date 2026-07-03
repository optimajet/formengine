import {array, boolean, define, node, toLabeledValues, useComponentData} from '@react-form-builder/core'
import cx from 'clsx'
import type {ReactNode, SyntheticEvent} from 'react'
import {useCallback} from 'react'
import type {NavProps} from 'rsuite'
import {Nav} from 'rsuite'
import {navProps} from '../commonProperties'
import {structureCategory} from './categories'
import styles from './RsTab.module.css'

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


/**
 * Tab component with navigation and pane support.
 * @param props the component props.
 * @param props.pane the pane content for the tab.
 * @param props.onSelect the callback when tab is selected.
 * @param props.showNavigation whether to show navigation.
 * @param props.items the items for the tab.
 * @param props.className the CSS class name.
 * @param props.props the additional tab props.
 * @returns the React element.
 */
const RsTab = ({
                 pane,
                 onSelect,
                 showNavigation,
                 items,
                 className,
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
      <Nav onSelect={onNavSelect} activeKey={activeKey} {...props} className={cx(styles.tabs, className)}>
        {items.map((item, index) => <Nav.Item key={index}
                                              eventKey={item.value}
                                              role="tab"
                                              as="button"
                                              type="button">
            {item.label}
          </Nav.Item>
        )}
      </Nav>
    }
    <div>{pane}</div>
  </>
}

export const rsTab = define(RsTab, 'RsTab')
  .name('Tab')
  .category(structureCategory)
  .props({
    ...navProps,
    items: array.localize.default(toLabeledValues(['Item1', 'Item2', 'Item3'])),
    showNavigation: boolean.default(true),
    pane: node
      .withSlotConditionBuilder(props => `return parentProps.activeKey === '${props.activeKey?.value ?? props.activeKey}'`)
      .calculable(false),
  })
