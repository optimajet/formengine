import {useStore} from './contexts/StoreContext'

/**
 * @returns the type of React component used to display the tooltip. **Internal use only.**
 */
export const useTooltipType = (): string | undefined => {
  const viewerStore = useStore()
  return viewerStore.form.tooltipType
}
