import type {ComponentStore} from '../../../stores/ComponentStore'
import {isUndefined} from '../../../utils/tools'

/**
 * Returns true if the component's data should be stored in the parent form's data, otherwise, false.
 * @param componentStore the component settings.
 * @returns true if the component's data should be stored in the parent form's data, otherwise, false.
 */
export function isStoreDataInParentForm(componentStore: ComponentStore) {
  const val = componentStore.props['storeDataInParentForm']?.value
  return isUndefined(val) ? true : val
}
