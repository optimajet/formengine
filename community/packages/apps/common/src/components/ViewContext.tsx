import {createNonNullableContext} from '@react-form-builder/core'

const name = 'BuilderViewContext'

/**
 * View type.
 */
export type ViewType = 'rsuite-inject-css' | 'rsuite-import-css' | 'mui' | 'mantine'

/**
 * The default builder view.
 */
export const defaultView: ViewType = 'mui'

type ViewContext = {
  view: ViewType
  setView: (viewType: ViewType) => void
  viewStorageKey: string
}

/**
 * Hook and provider for the builder view context.
 */
export const [useView, ViewProvider] = createNonNullableContext<ViewContext>(name)
