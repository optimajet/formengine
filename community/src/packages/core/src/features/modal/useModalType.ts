import {useStore} from '../../utils/contexts/StoreContext'

/**
 * @returns the type name of the React component used to display the modal. **Internal use only.**
 */
export const useModalType = () => {
  const viewerStore = useStore()
  return viewerStore.form.modalType
}
