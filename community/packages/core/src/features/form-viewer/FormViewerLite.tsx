import {useMemo} from 'react'
import {namedObserver} from '../../utils/namedObserver'
import {useMobxConfig} from '../../utils/useMobxConfig'
import {NoopLocalizationEngine} from '../localization/NoopLocalizationEngine'
import {ViewerLocalizationProvider} from '../localization/ViewerLocalizationProvider'
import {SuppressResizeObserverErrors} from '../ui/SuppressResizeObserverErrors'
import {Viewer} from './components/Viewer'
import {ViewerStoreProvider} from './components/ViewerStoreProvider'
import {ViewerWrapper} from './components/ViewerWrapper'
import type {FormViewerProps} from './types'

/**
 * A lightweight version of the form viewer that uses NoopLocalizationEngine by default.
 * @param props the React component properties.
 * @returns the React element.
 */
const RawFormViewerLite = (props: FormViewerProps) => {
  useMobxConfig()

  const finalProps: FormViewerProps = useMemo(() => ({
    ...props,
    localizationEngine: props.localizationEngine ?? new NoopLocalizationEngine(),
  }), [props])

  return <SuppressResizeObserverErrors>
    <ViewerStoreProvider props={finalProps}>
      <ViewerLocalizationProvider>
        <ViewerWrapper>
          <Viewer/>
        </ViewerWrapper>
      </ViewerLocalizationProvider>
    </ViewerStoreProvider>
  </SuppressResizeObserverErrors>
}

export const FormViewerLite = namedObserver('FormViewerLite', RawFormViewerLite)
