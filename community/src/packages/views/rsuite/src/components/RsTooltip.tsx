import type {WrapperProps} from '@react-form-builder/core'
import {define, node, oneOf, someOf, string} from '@react-form-builder/core'
import {useMemo} from 'react'
import {Tooltip, Whisper} from 'rsuite'
import type {OverlayTriggerType} from 'rsuite/esm/internals/Overlay/OverlayTrigger'
import type {TypeAttributes} from 'rsuite/esm/internals/types'
import {staticCategory} from './categories'

/**
 * The properties of RsTooltip component.
 */
export interface RsTooltipProps extends WrapperProps {
  /**
   * The tooltip text.
   */
  text: string
  /**
   * The placement of a tooltip.
   */
  placement: TypeAttributes.Placement
  /**
   * The tooltip trigger.
   */
  trigger: OverlayTriggerType
}

const wrapperStyle = {width: '100%', height: '100%'} as const

const RsTooltip = ({text, placement, trigger, children, ...props}: RsTooltipProps) => {
  const tooltip = useMemo(() => <Tooltip>{text}</Tooltip>, [text])

  if (!children) return null

  return <Whisper placement={placement} trigger={trigger} speaker={tooltip}>
    <div {...props} style={wrapperStyle}>{children}</div>
  </Whisper>
}

/**
 * Metadata builder for rSuite-based tooltip display component.
 */
export const rsTooltip = define(RsTooltip, 'RsTooltip')
  .name('Tooltip')
  .category(staticCategory)
  .props({
    text: string.required.default('Tooltip message...').hinted('Tooltip text').dataBound,
    children: node,
    placement: oneOf('top', 'bottom', 'right', 'left', 'bottomStart', 'bottomEnd',
      'topStart', 'topEnd', 'leftStart', 'rightStart', 'leftEnd', 'rightEnd', 'auto',
      'autoVertical', 'autoVerticalStart', 'autoVerticalEnd', 'autoHorizontal', 'autoHorizontalStart')
      .required.default('bottom')
      .withEditorProps({creatable: false}),
    trigger: someOf('click', 'hover', 'focus', 'active', 'contextMenu')
      .required.default(['hover'])
  })
  .componentRole('tooltip')
