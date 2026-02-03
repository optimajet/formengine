import {createAnnotation} from './utils/createAnnotation'

/**
 * The event handler function.
 */
export type EventHandler = (...args: unknown[]) => unknown

/**
 * The annotation builder for a component property with type 'event' (or event handler, or just a function).
 */
export const event = createAnnotation<EventHandler>('event').setup({annotationType: 'Event'})
