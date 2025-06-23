import type {ReactNode} from 'react'
import {createElement, useCallback} from 'react'
import type {ComponentStore} from '../../stores/ComponentStore'
import {namedObserver} from '../../utils'
import {useComponentData} from '../../utils/contexts/ComponentDataContext'
import {useStore} from '../../utils/contexts/StoreContext'
import {useTooltipType} from '../../utils/useTooltipType'
import {useWrapperState} from '../../utils/useWrapperState'
import type {Model} from '../define'
import {useViewerProps} from '../form-viewer/components/ViewerPropsContext'

/**
 * Tooltip React component wrapper properties.
 */
export interface TooltipWrapperProps {
  /**
   * The React child node.
   */
  children: ReactNode
}

/**
 * Tooltip React component properties.
 */
interface ComponentTooltipProps {
  tooltipDefinition: Model
  children: ReactNode
}

function useTooltipComponent() {
  const formViewerProps = useViewerProps()
  const selectedTooltipType = useTooltipType()
  if (!selectedTooltipType) return
  return formViewerProps.view.get(selectedTooltipType)
}

const RawComponentTooltip = ({tooltipDefinition, children}: ComponentTooltipProps) => {
  const viewerStore = useStore()
  const wrappedComponentData = useComponentData()
  const wrappedComponentStore = wrappedComponentData.store
  const localize = useCallback((componentStore: ComponentStore) => {
    return viewerStore.localizeComponent('tooltip', wrappedComponentData.dataRoot, componentStore)
  }, [viewerStore, wrappedComponentData])
  const componentState = useWrapperState(wrappedComponentData, tooltipDefinition, wrappedComponentStore.tooltipProps, localize)
  return createElement(tooltipDefinition.component, componentState.ownProps, children)
}

const ComponentTooltip = namedObserver('ComponentTooltip', RawComponentTooltip)

/**
 * Tooltip React component wrapper.
 * @param props the React component properties.
 * @param props.children the React child node.
 * @returns the React element.
 */
const RawTooltipWrapper = ({children}: TooltipWrapperProps) => {
  const tooltipDefinition = useTooltipComponent()
  if (!tooltipDefinition) return <>{children}</>
  return <ComponentTooltip tooltipDefinition={tooltipDefinition}>{children}</ComponentTooltip>
}

export const TooltipWrapper = namedObserver('TooltipWrapper', RawTooltipWrapper)
