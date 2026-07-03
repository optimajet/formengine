/**
 * The generic type that returns the first parameter of the generic type T. **Internal use only.**
 */
export type FirstParameter<T extends (...args: any) => any> = Parameters<T>[0]
