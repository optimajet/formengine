import {createNonNullableContext} from '@react-form-builder/core'

const name = 'ViewContext'

/**
 * The type of view.
 */
export type ViewType = 'rsuite' | 'mui'

type ViewContext = {
  view: ViewType
  setView: (viewType: ViewType) => void
}

/**
 * Hook and provider for the view context.
 */
export const [useView, ViewProvider] = createNonNullableContext<ViewContext>(name)
