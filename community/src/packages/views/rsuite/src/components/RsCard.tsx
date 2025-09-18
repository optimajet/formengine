import {boolean, define, event, node, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import type {PanelProps} from 'rsuite'
import {Panel} from 'rsuite'
import {headerSize} from '../commonProperties'
import {RsHeader} from './RsHeader'

interface RsCardProps extends PanelProps {
  title?: string
  headerSize: string
}

type PanelHeaderProps = Pick<RsCardProps, 'title' | 'headerSize' | 'header'>

const PanelHeader = ({title, headerSize, header}: PanelHeaderProps) => (
  <div>
    {!!title && <RsHeader headerSize={headerSize} content={title}/>}
    {header}
  </div>
)

const RsCard = ({header, title, headerSize, ...props}: RsCardProps) => {
  const panelHeader = useMemo(() => {
    return <PanelHeader title={title} headerSize={headerSize} header={header}/>
  }, [header, headerSize, title])

  return <Panel header={panelHeader} {...props}/>
}

export const rsCard = define(RsCard, 'RsCard')
  .name('Card')
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
