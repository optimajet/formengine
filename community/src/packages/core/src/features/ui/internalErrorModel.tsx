import type {CSSProperties} from 'react'
import {ComponentStore} from '../../stores/ComponentStore'
import {Model} from '../define'
import {addOrUpdateFeatures} from '../define/utils/ComponentFeature'
import {cfHideFromComponentPalette} from '../define/utils/integratedComponentFeatures'
import {screenModel} from './screenModel'

/**
 * React component properties that display an internal form view error. **Internal use only.**
 */
export interface InternalErrorProps {
  /**
   * The internal error.
   */
  error: any
}

const internalErrorStyle: CSSProperties = {
  color: 'red'
}

const InternalError = ({error}: InternalErrorProps) => {
  return <h1 style={internalErrorStyle}>{error?.message ?? JSON.stringify(error)}</h1>
}
InternalError.displayName = 'InternalError'

const internalErrorFeatures = addOrUpdateFeatures({},
  {name: cfHideFromComponentPalette, value: true},
)

/**
 * Form viewer internal error metadata. **Internal use only.**
 * @internal
 */
export const internalErrorModel = new Model(InternalError, undefined, undefined, undefined, undefined,
  undefined, undefined, undefined, undefined, undefined, undefined, undefined,
  undefined, undefined, undefined, internalErrorFeatures)

/**
 * Creates the component setting for the internal form viewer error.
 * @param error the internal error.
 * @returns the component setting for the internal form viewer error.
 */
export function buildInternalErrorStore(error: any) {
  const componentStore = new ComponentStore(internalErrorModel.name, internalErrorModel.type)
  componentStore.props['error'] = {value: error}
  const screen = new ComponentStore(screenModel.name, screenModel.type)
  screen.children = [componentStore]
  return screen
}

/**
 * Creates component metadata for the form viewer representing an internal error.
 * @param error the internal error.
 * @returns the component metadata for the form viewer representing an internal error.
 */
export function buildInternalErrorModel(error: any) {
  const defaultProps = {error: error}
  return new Model(InternalError, undefined, undefined, undefined, undefined, defaultProps)
}
