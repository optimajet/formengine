import type {ComponentStore} from '../../../stores/ComponentStore'

/**
 * Calculates the property value for the field.
 * @param component the component settings.
 * @param key the property's key.
 */
export type CalculatePropertyFn = (component: ComponentStore, key: string) => [boolean, any?]
