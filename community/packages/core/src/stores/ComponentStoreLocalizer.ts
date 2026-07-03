import type {ComponentStore} from './ComponentStore'

/**
 * Represents a function that localizes components based on the supplied component store.
 */
export type ComponentStoreLocalizer = (componentStore: ComponentStore) => Record<string, any>
