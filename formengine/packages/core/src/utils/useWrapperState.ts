import {useMemo} from 'react'
import type {Model} from '../features/define'
import {ComponentState} from '../stores/ComponentState'
import {ComponentStore} from '../stores/ComponentStore'
import type {ComponentStoreLocalizer} from '../stores/ComponentStoreLocalizer'
import type {Store} from '../stores/Store'
import type {ComponentData} from './contexts/ComponentDataContext'
import {useStore} from './contexts/StoreContext'

const getWrapperState = (viewerStore: Store, wrappedComponentData: ComponentData, componentModel: Model,
                         wrapperProps: any, localizer: ComponentStoreLocalizer) => {
  const componentStore = new ComponentStore(wrappedComponentData.key, componentModel.type)
  componentStore.props = wrapperProps
  const componentData = viewerStore.createComponentData(componentStore, false)
  componentData.dataRootProvider = {
    get dataRoot() {
      return wrappedComponentData.dataRoot
    }
  }
  componentData.componentState = new ComponentState(componentData, viewerStore, localizer, () => ({}))
  return componentData.componentState
}

/**
 * Generates the component state for the wrapper component. For example, a tooltip or error message.
 * @param wrappedComponentData the wrapped component.
 * @param componentModel the component metadata.
 * @param wrapperProps the wrapper component props.
 * @param localizer the function used to localize the component.
 * @returns the component state for the wrapper component
 */
export const useWrapperState = (wrappedComponentData: ComponentData, componentModel: Model,
                                wrapperProps: any, localizer: ComponentStoreLocalizer) => {
  const viewerStore = useStore()
  return useMemo(() => getWrapperState(viewerStore, wrappedComponentData, componentModel, wrapperProps, localizer),
    [viewerStore, wrappedComponentData, componentModel, wrapperProps, localizer])
}
