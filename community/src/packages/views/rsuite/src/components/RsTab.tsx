import styled from '@emotion/styled'
import {array, boolean, define, node, toLabeledValues, useComponentData} from '@react-form-builder/core'
import type {ReactNode, SyntheticEvent} from 'react'
import type {NavProps} from 'rsuite'
import {Nav} from 'rsuite'
import {navProps} from '../commonProperties'

type RsItem = {
  label: string
  value: string
}

interface RsTabProps extends NavProps {
  items?: RsItem[]
  showNavigation?: boolean
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

const RsTab = ({
                 pane,
                 onSelect,
                 showNavigation,
                 items,
                 ...props
               }: RsTabProps) => {
  const componentData = useComponentData()

  if (!items?.length) return null

  const onNavSelect = (eventKey: string, event: SyntheticEvent) => {
    componentData.userDefinedProps ??= {}
    componentData.userDefinedProps.activeKey = eventKey
    onSelect?.(eventKey, event)
  }

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
  .props({
    ...navProps,
    items: array.default(toLabeledValues(['Item1', 'Item2', 'Item3'])),
    showNavigation: boolean.hinted('Show or hide navigation').default(true),
    pane: node
      .withSlotConditionBuilder(props => `return parentProps.activeKey === '${props.activeKey?.value ?? props.activeKey}'`)
      .calculable(false).hinted('A child component of the tab'),
  })
