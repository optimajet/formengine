import type {ComponentData} from '../../../utils/contexts/ComponentDataContext'

/**
 * The function that restricts the insertion of a component into another component.
 */
export type InsertRestrictionFn = (self: ComponentData, target: ComponentData, slot?: string) => boolean
