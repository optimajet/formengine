import type {EmbeddedFormProps} from './EmbeddedFormProps'

/**
 * The template component properties.
 */
export interface TemplateProps extends Omit<EmbeddedFormProps, 'formName'> {
}
