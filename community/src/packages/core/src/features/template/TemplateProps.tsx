import type {EmbeddedFormProps} from './EmbeddedFormProps'

/**
 * The template component properties.
 */
export type TemplateProps = Omit<EmbeddedFormProps, 'formName'>
