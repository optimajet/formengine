import type {ComponentType, ReactNode} from 'react'
import type {Language} from '../../localization/language'

/**
 * Represents a form viewer Wrapper component.
 */
export type FormViewerWrapper = ComponentType<FormViewerWrapperComponentProps>

/**
 * Represents the props for the WrapperComponent. WrapperComponent is a component that wraps the form viewer. Can be added externally.
 */
export interface FormViewerWrapperComponentProps {
  /**
   * The FormViewer language.
   */
  language: Language
  /**
   * The React child node.
   */
  children: ReactNode
}
