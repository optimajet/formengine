import {css, cx} from '@emotion/css'
import type {DetailedHTMLProps, HTMLAttributes} from 'react'
import {useMemo} from 'react'
import {namedObserver} from '../../utils'
import {useMobxConfig} from '../../utils/useMobxConfig'
import {ViewerLocalizationProvider} from '../localization/ViewerLocalizationProvider'
import {SuppressResizeObserverErrors} from '../ui/SuppressResizeObserverErrors'
import {Viewer} from './components/Viewer'
import {ViewerStoreProvider} from './components/ViewerStoreProvider'
import type {FormViewerProps} from './types'

const divClass = css`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 5px;
`

/**
 * The React component that wraps every component in a form.
 * @param props the React component properties.
 * @returns the React element.
 */
export const SDiv = (props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const {className, children, ...otherProps} = props
  const cls = useMemo(() => cx(divClass, className), [className])
  return <div className={cls} {...otherProps}>{children}</div>
}

//No other code here
/**
 * The main React component of the form viewer.
 * @param props the React component properties.
 * @returns the React element.
 */
const RawFormViewer = (props: FormViewerProps) => {
  useMobxConfig()

  return (
    <SuppressResizeObserverErrors>
      <ViewerStoreProvider props={props}>
        <ViewerLocalizationProvider>
          <SDiv>
            <Viewer/>
          </SDiv>
        </ViewerLocalizationProvider>
      </ViewerStoreProvider>
    </SuppressResizeObserverErrors>
  )
}

export const FormViewer = namedObserver('FormViewer', RawFormViewer)
