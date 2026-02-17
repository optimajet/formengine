import {MantineContext, MantineProvider} from '@mantine/core'
import type {FormViewerWrapperComponentProps} from '@react-form-builder/core'
import {useBuilderTheme} from '@react-form-builder/core'
import {useContext} from 'react'

/**
 * The wrapper component for Mantine components. Adds a MantineProvider if it does not exist.
 * @param props the component props.
 * @param props.children the children components to be wrapped.
 * @returns the wrapped components.
 */
export const MtViewerWrapper = ({children}: FormViewerWrapperComponentProps) => {
  const builderTheme = useBuilderTheme()
  const context = useContext(MantineContext)

  return context
    ? <>{children}</>
    : <MantineProvider forceColorScheme={builderTheme}>{children}</MantineProvider>
}
