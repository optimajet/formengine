import {createNonNullableContext} from '@react-form-builder/core'

const name = 'BuilderViewContext'

/**
 * The type of builder view.
 */
export type ViewType = 'rsuite' | 'mui' | 'mantine'

const allViews: Record<ViewType, undefined> = {
  rsuite: undefined,
  mui: undefined,
  mantine: undefined,
}

/**
 * All available views (component libraries).
 */
export const availableView = Object.keys(allViews) as ViewType[]

/**
 * The default builder view.
 */
export const defaultView: ViewType = 'mui'

type ViewContext = {
  view: ViewType
  setView: (viewType: ViewType) => void
}

/**
 * Hook and provider for the builder view context.
 */
export const [useView, ViewProvider] = createNonNullableContext<ViewContext>(name)
