import {useCallback, useMemo} from 'react'
import {ComponentState} from '../../stores/ComponentState'
import {ComponentStore} from '../../stores/ComponentStore'
import type {ComponentData} from '../../utils/contexts/ComponentDataContext'
import {useStore} from '../../utils/contexts/StoreContext'

/**
 * Returns the modal's {@link ComponentStore}.
 * @param type the modal's React component type.
 * @param parentComponentStore the modal's parent {@link ComponentStore}.
 * @returns the modal's {@link ComponentStore}.
 */
const useModalComponentStore = (type: string, parentComponentStore: ComponentStore) => {
  const key = parentComponentStore.key
  const modalStore = parentComponentStore.modal

  return useMemo(() => {
    return ComponentStore.createFromObject({
      key,
      type,
      ...modalStore
    })
  }, [key, type, modalStore])
}

/**
 * Generates the {@link ComponentData} for the modal component.
 * @param parentComponentData the modal's parent component.
 * @param modalType the modal type.
 * @returns the generated {@link ComponentData} for the modal component.
 */
export const useModalComponentData = (parentComponentData: ComponentData, modalType: string) => {
  const viewerStore = useStore()
  const componentStore = useModalComponentStore(modalType, parentComponentData.store)

  const localizer = useCallback((componentStore: ComponentStore) => {
    return viewerStore.localizeComponent('modal', parentComponentData.dataRoot, componentStore)
  }, [viewerStore, parentComponentData])

  return useMemo(() => {
    const componentData = viewerStore.createComponentData(componentStore, false)
    componentData.dataRootProvider = {
      get dataRoot() {
        return parentComponentData.dataRoot
      }
    }
    componentData.componentState = new ComponentState(componentData, viewerStore, localizer, () => ({}))
    return componentData
  }, [viewerStore, localizer, componentStore, parentComponentData.dataRoot])
}
