import type {ComponentStore} from '../../../stores/ComponentStore'

/**
 * Returns true if the component's data should be stored in the parent form's data, otherwise, false.
 * @param componentStore the component settings.
 * @returns true if the component's data should be stored in the parent form's data, otherwise, false.
 */
export function isStoreDataInParentForm(componentStore: ComponentStore) {
  const val = componentStore.props['storeDataInParentForm']?.value
  return typeof val === 'undefined' ? true : val
}

/**
 * Returns 'Required' or message if it is passed.
 * @param message the message
 * @returns 'Required' or message if it is passed.
 */
export const required = (message: string) => message ?? 'Required'
