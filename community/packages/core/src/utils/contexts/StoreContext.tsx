import type {Store} from '../../stores/Store'
import {createNonNullableContext} from '../createNonNullableContext'

export const [
  /**
   * **Internal use only.**
   */
  useStore,
  /**
   * **Internal use only.**
   */
  StoreProvider,
  /**
   * **Internal use only.**
   */
  StoreContext] = createNonNullableContext<Store>('StoreContext')
