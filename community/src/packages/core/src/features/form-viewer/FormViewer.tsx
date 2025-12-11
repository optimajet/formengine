import {useMemo} from 'react'
import {namedObserver} from '../../utils'
import {useMobxConfig} from '../../utils/useMobxConfig'
import {FluentLocalizationEngine} from '../localization/fluent/FluentLocalizationEngine'
import {ViewerLocalizationProvider} from '../localization/ViewerLocalizationProvider'
import {SuppressResizeObserverErrors} from '../ui/SuppressResizeObserverErrors'
import {Viewer} from './components/Viewer'
import {ViewerStoreProvider} from './components/ViewerStoreProvider'
import {ViewerWrapper} from './components/ViewerWrapper'
import type {FormViewerProps} from './types'

/**
 * The main React component of the form viewer.
 * @param props the React component properties.
 * @returns the React element.
 */
const RawFormViewer = (props: FormViewerProps) => {
  useMobxConfig()

  const localizationEngine = useMemo(() => props.localizationEngine ?? new FluentLocalizationEngine(), [props.localizationEngine])
  const finalProps = useMemo(() => ({
    ...props,
    localizationEngine
  }), [localizationEngine, props])

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

export const FormViewer = namedObserver('FormViewer', RawFormViewer)
