import type {ReactNode} from 'react'
import {createAnnotation, createProperty} from './utils'
import {createNodeAnnotation} from './utils/builders/NodeAnnotationBuilder'
import {isUniqueKey} from './utils/isUniqueKey'

/**
 * The annotation for the 'key' property of the component.
 */
export const key = createAnnotation('key')
  .typed('string')
  .required
  .hinted('Unique component key')
  .calculable(false)
  .validated(isUniqueKey, {code: 'unique_key', message: 'The key must be unique!'})
  .build('key')

/**
 * The annotation builder for the 'key' property of a component.
 */
export const htmlAttributes = createAnnotation('htmlAttributes')

/**
 * The annotation builder for arbitrary HTML attributes of a component.
 */
export const validation = createAnnotation('validation')

/**
 * The annotation builder for a component property with type 'string'.
 */
export const string = createProperty('string').typed('string').localize

/**
 * The annotation builder for a component property with type 'object'. It can accommodate any nested POJO that contains primitive values.
 */
export const object = createProperty('object').typed('object')

/**
 * The annotation builder for a component property with type 'boolean'.
 */
export const boolean = createProperty('boolean').typed('boolean')

/**
 * Annotation builder for a read-only property of a component with type 'boolean'.
 */
export const readOnly = boolean.setup({readOnly: true})

/**
 * Annotation builder for a disabled property of a component with type 'boolean'.
 */
export const disabled = boolean.setup({disabled: true})

/**
 * The annotation builder for a component property with type 'number'.
 */
export const number = createProperty('number').typed('number')

/**
 * The annotation builder for a component property with type 'CSS unit' (width, height, etc.).
 */
export const size = createProperty('size').typed('string')

/**
 * The annotation builder for a component property with type 'Date'.
 */
export const date = createProperty('date').typed('date')

/**
 * The annotation builder for a component property with type 'Time'.
 */
export const time = createProperty('time').typed('time')

/**
 * The annotation builder for a component property with type 'Array'.
 */
export const array = createProperty('array').array

/**
 * The annotation builder for a component property with type 'color' (e.g. rgba(71, 167, 122, 0.72)).
 */
export const color = createProperty('color').typed('string')

/**
 * The annotation builder for the form property describing the type of form tooltip.
 */
export const tooltipType = createAnnotation('tooltipType').typed('string')

/**
 * The annotation builder for a component property containing a CSS dimension.
 */
export const cssSize = createAnnotation('size').setup({calculable: false})

/**
 * The annotation builder for a component property containing a CSS color.
 */
const cssColor = createAnnotation('color').setup({calculable: false})

/**
 * The annotation builder for the component property containing the CSS class name.
 */
export const className = createProperty('string')
  .calculable(true)
  .build('className')

/**
 * The annotation builder for a component property with type 'event' (or event handler, or just a function).
 */
export const event = createAnnotation<Function>('event').setup({annotationType: 'Event'})

/**
 * The annotation builder for a component property with type 'ReactNode'.
 */
export const node = createNodeAnnotation<ReactNode>('node').setup({annotationType: 'Container'})

/**
 * The annotation builder for a component property with type 'ReactNode'/'string'.
 */
export const stringNode = createNodeAnnotation<ReactNode>('node')
  .setup({annotationType: 'Container'})
  .withDefaultEditor('string')

/**
 * The annotation builder for a component property with type 'ReactNode[]'.
 */
export const nodeArray = createNodeAnnotation<ReactNode[]>('nodeArray')
  .setup({annotationType: 'Container', bindingType: 'array'})

/**
 * The annotation builder for a component property with type 'enum', the property value can only be one of enum.
 */
export const oneOf = createProperty('oneOf').oneOf.bind(createProperty('oneOf'))

/**
 * The annotation builder for a component property with type 'enum', the property value can contain multiple enum values.
 */
export const someOf = createProperty('someOf').someOf.bind(createProperty('someOf'))

/**
 * The annotation builder for component tooltip properties.
 */
export const tooltipProps = createAnnotation('tooltipProps')

/**
 * The annotation builder for the synthetic 'renderWhen' property of the component.
 */
export const renderWhen = createAnnotation('renderWhen').typed('boolean')

/**
 * The annotation builder for a component property with type 'function'.
 * @param fnDescriptionBegin the beginning of function description.
 * @param fnDescriptionEnd the ending  of function description.
 * @returns the annotation builder for a component property with type 'function'.
 * @example
 * ```ts
 * // Example usage with TSDoc-style function description:
 * fn(
 *   `/**
 *     * @param {string} value
 *     * @param {ItemDataType} item
 *     * @return {boolean}
 *     *\/
 *   function filterBy(value, item) {`
 * )
 * ```
 * This will create a function property with proper type hints and documentation
 * that describes a filter function taking a string and an item, returning a boolean.
 */
export const fn = (fnDescriptionBegin: string, fnDescriptionEnd = '}') => {
  return createProperty('function')
    .typed('string')
    .calculable(false)
    .withEditorProps({
      beginContextLine: fnDescriptionBegin,
      endContextLine: fnDescriptionEnd,
    })
}

/**
 * The annotations for generic CSS properties of a component.
 */
export const commonStyles = {
  width: cssSize.setup({default: '100%'}),
  height: cssSize,
  marginTop: cssSize,
  marginInlineEnd: cssSize,
  marginBottom: cssSize,
  marginInlineStart: cssSize,
  color: cssColor,
  backgroundColor: cssColor,
}

/**
 * The annotations for generic CSS properties of a container component.
 */
export const containerStyles = {
  flexDirection: oneOf('column', 'row', 'column-reverse', 'row-reverse'),
  gap: size,
  alignItems: oneOf('start', 'center', 'baseline', 'end', 'stretch'),
  justifyContent: oneOf('flex-start', 'flex-end', 'center', 'space-between', 'space-around',
    'space-evenly', 'start', 'end', 'left', 'right'),
  flexWrap: oneOf('wrap', 'nowrap', 'wrap-reverse')
}

export * from './utils'
export {timeFormat} from './consts'
