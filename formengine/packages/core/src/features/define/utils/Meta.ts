import type {ComponentType, ReactNode} from 'react'
import type {Annotation} from '../../annotation/types/annotations/Annotation'
import type {ComponentKind} from '../types'
import type {ComponentMetadataEventListeners} from './ComponentMetadataEventListeners'
import type {InsertRestrictionFn} from './InsertRestrictionFn'

/**
 * Component metadata for the form builder.
 */
export class Meta {
  /**
   * Creates the component metadata for the form builder.
   * @param type the component type name.
   * @param properties the component's properties metadata.
   * @param css the component's CSS metadata.
   * @param wrapperCss the component's wrapper CSS metadata.
   * @param modules common metadata for the component.
   * @param customPreview the custom ReactNode to be drawn on the toolbar.
   * @param valuedAn the metadata for the component value.
   * @param kind the component kind.
   * @param initialJson the JSON source for the component (instance of {@link ComponentStore} class serialised to JSON).
   * @param eventListeners the component metadata event listeners.
   * @param icon the component icon.
   * @param insertRestriction the function that restricts the insertion of a component into another component.
   */
  constructor(
    readonly type: string,
    readonly properties: Annotation[],
    readonly css: Annotation[],
    readonly wrapperCss: Annotation[],
    readonly modules: Annotation[],
    readonly customPreview?: ReactNode,
    readonly valuedAn?: Annotation,
    readonly kind: ComponentKind = 'component',
    readonly initialJson?: string,
    readonly eventListeners?: ComponentMetadataEventListeners,
    readonly icon?: ComponentType,
    readonly insertRestriction?: InsertRestrictionFn,
  ) {
  }
}
