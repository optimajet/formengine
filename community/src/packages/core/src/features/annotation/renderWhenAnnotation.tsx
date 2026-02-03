import {createAnnotation} from './utils/createAnnotation'

/**
 * The annotation builder for the synthetic 'renderWhen' property of the component.
 */
export const renderWhen = createAnnotation('renderWhen').typed('boolean')
