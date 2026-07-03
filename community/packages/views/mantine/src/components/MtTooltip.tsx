import {Tooltip} from '@mantine/core'
import type {TooltipProps} from '@mantine/core/lib/components/Tooltip/Tooltip'
import {boolean, define, node, number, oneOfStrict, string} from '@react-form-builder/core'
import type {ReactNode} from 'react'
import {overlaysCategory} from './internal/categories'

import {floatingPosition} from './internal/sharedProps'

/**
 * Props for the MtTooltip component.
 */
interface MtTooltipProps extends Partial<TooltipProps> {
  /**
   * The content text displayed in the tooltip.
   */
  content: string

  /**
   * The trigger element that shows the tooltip on hover.
   */
  children?: ReactNode

  /**
   * The distance in pixels between the trigger and the tooltip content.
   */
  offset?: number
}

/**
 * Mantine tooltip component for React Form Builder.
 * @param props component properties.
 * @returns tooltip component.
 */
export function MtTooltip(props: MtTooltipProps) {
  const {content, children, offset = 4, ...others} = props
  return (
    <Tooltip label={content} offset={offset} {...others}>
      <span>{children || 'Hover me'}</span>
    </Tooltip>
  )
}

export const mtTooltip = define(MtTooltip, 'MtTooltip')
  .category(overlaysCategory)
  // TODO FE-1803 add support for transitionProps, events, target, refProp, floatingStrategy, middlewares, positionDependencies, onPositionChange, and offset object.
  .props({
    content: string.default('Tooltip content'),
    children: node,
    offset: number.default(4),
    position: floatingPosition.default('top'),
    withArrow: boolean.default(false),
    arrowPosition: oneOfStrict('center', 'side').default('center'),
    arrowOffset: number,
    arrowSize: number,
    arrowRadius: number,
    radius: string,
    color: string,
    opened: boolean,
    defaultOpened: boolean,
    disabled: boolean.default(false),
    withinPortal: boolean.default(true),
    keepMounted: boolean.default(false),
    zIndex: number,
    autoContrast: boolean.default(false),
    variant: oneOfStrict('filled', 'light').default('filled'),
    inline: boolean.default(false),
    multiline: boolean.default(false),
    openDelay: number,
    closeDelay: number,
  })
  .componentRole('tooltip')
