/**
 * Type of component property description in the form builder.
 */
export type AnnotationType = 'Property' | 'Container' | 'Event' | 'Module' | 'Style'

/**
 * The generic type that returns the first parameter of the generic type T. **Internal use only.**
 */
export type FirstParameter<T extends (...args: any) => any> = Parameters<T>[0]
