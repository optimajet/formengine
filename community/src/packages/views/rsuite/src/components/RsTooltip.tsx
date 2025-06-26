import type {WrapperProps} from '@react-form-builder/core'
import {define, node, oneOf, someOf, string} from '@react-form-builder/core'
import {Tooltip, Whisper} from 'rsuite'
import type {OverlayTriggerType} from 'rsuite/esm/internals/Overlay/OverlayTrigger'
import type {TypeAttributes} from 'rsuite/esm/internals/types'

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

const RsTooltip = ({text, placement, trigger, children}: RsTooltipProps) => {
  if (!children) return null

  return <Whisper placement={placement} trigger={trigger} speaker={<Tooltip>{text}</Tooltip>}>
    <div style={{width: '100%', height: '100%'}}>{children}</div>
  </Whisper>
}

/**
 * Metadata builder for rSuite-based tooltip display component.
 */
export const rsTooltip = define(RsTooltip, 'RsTooltip')
  .name('Tooltip')
  .props({
    text: string.required.default('Tooltip message...').hinted('Tooltip text'),
    children: node,
    placement: oneOf('top', 'bottom', 'right', 'left', 'bottomStart', 'bottomEnd',
      'topStart', 'topEnd', 'leftStart', 'rightStart', 'leftEnd', 'rightEnd', 'auto',
      'autoVertical', 'autoVerticalStart', 'autoVerticalEnd', 'autoHorizontal', 'autoHorizontalStart')
      .required.default('bottom'),
    trigger: someOf('click', 'hover', 'focus', 'active', 'contextMenu')
      .required.default(['hover'])
  })
