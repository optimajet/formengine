import {boolean, define, event, node, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import type {PanelProps} from 'rsuite'
import {Panel} from 'rsuite'
import {headerSize} from '../commonProperties'
import {structureCategory} from './categories'
import {RsHeader} from './RsHeader'

/**
 * Props for the RsCard component.
 */
export interface RsCardProps extends PanelProps {
  /**
   * Title for the card.
   */
  title?: string
  /**
   * Header size for the card.
   */
  headerSize: string
}

/**
 * Props for the PanelHeader component.
 */
type PanelHeaderProps = Pick<RsCardProps, 'title' | 'headerSize' | 'header'>

/**
 * Panel header component with title and header size support.
 * @param props the component props.
 * @param props.title the title for the panel header.
 * @param props.headerSize the header size for the panel header.
 * @param props.header the header content for the panel header.
 * @returns the React element.
 */
const PanelHeader = ({title, headerSize, header}: PanelHeaderProps) => (
  <div>
    {!!title && <RsHeader headerSize={headerSize} content={title}/>}
    {header}
  </div>
)

/**
 * Card component with header and title support.
 * @param props the component props.
 * @param props.header the header content for the card.
 * @param props.title the title for the card.
 * @param props.headerSize the header size for the card.
 * @param props.props the additional panel props.
 * @returns the React element.
 */
const RsCard = ({header, title, headerSize, ...props}: RsCardProps) => {
  const panelHeader = useMemo(() => {
    return <PanelHeader title={title} headerSize={headerSize} header={header}/>
  }, [header, headerSize, title])

  return <Panel header={panelHeader} {...props}/>
}

export const rsCard = define(RsCard, 'RsCard')
  .name('Card')
  .category(structureCategory)
  .props({
    header: node,
    children: node,
    title: string.default('Title'),
    headerSize,
    bodyFill: boolean.default(false),
    bordered: boolean.default(true),
    shaded: boolean.default(true),
    defaultExpanded: boolean.default(false),
    collapsible: boolean.default(false),
    eventKey: string,
    onSelect: event
  })
