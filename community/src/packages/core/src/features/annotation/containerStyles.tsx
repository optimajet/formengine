import {oneOf} from './oneOfAnnotation'
import {size} from './sizeAnnotation'

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
