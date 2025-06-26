import type {ComponentData} from './contexts/ComponentDataContext'

/**
 * Function that calculates all child properties of a component. **Internal use only.**
 * @param componentData the data required to display a component.
 * @param componentProps the calculated properties of the component.
 * @returns the Record with calculated child properties.
 */
export type ComputeChildren = (componentData: ComponentData,
                               componentProps: Record<string, any>) => Record<string, any>
