import cx from 'clsx'
import {Fragment, useContext, useEffect, useLayoutEffect, useMemo} from 'react'
import {useComponentData} from '../../utils/contexts/ComponentDataContext'
import {useStore} from '../../utils/contexts/StoreContext'
import {namedObserver} from '../../utils/namedObserver'
import {reactMajor} from '../../utils/reactVersion'
import {cfDisableStyles, cfDisableWrapperStyles} from '../define/utils/integratedComponentFeatures'
import {useViewerProps} from '../form-viewer/components/ViewerPropsContext'
import {getCellInfoPropertiesContext} from '../properties-context/getCellInfoPropertiesContext'
import {CellInfoContext} from '../table/CellInfoContext'
import {TooltipWrapper} from '../tooltip/TooltipWrapper'
import {Erroneous} from '../validation/components/Erroneous'
import {DefaultWrapper} from './DefaultWrapper'

const RawComponentViewer = () => {
  const data = useComponentData()
  const formViewerStore = useStore()
  const {componentWrapper} = useViewerProps()

  const cellInfoContext = useContext(CellInfoContext)
  const componentState = useMemo(() => {
    if (!cellInfoContext) return data.componentState

    const cellInfoPropertiesContext = getCellInfoPropertiesContext(data, cellInfoContext, formViewerStore)
    return formViewerStore.componentStateFactory(data, formViewerStore, cellInfoPropertiesContext)
  }, [data, formViewerStore, cellInfoContext])

  const {flatCss, flatWrapperCss}  = componentState

  useLayoutEffect(() => {
    // This keeps stylesheets to be in sync in case of component remount.
    componentState.applyStyles('css', flatCss)
  }, [componentState, flatCss])

  useLayoutEffect(() => {
    // This keeps stylesheets to be in sync in case of component remount.
    componentState.applyStyles('wrapperCss', flatWrapperCss)
  }, [componentState, flatWrapperCss])

  useEffect(() => {
    componentState.onDidMount()
    return () => {
      componentState.onWillUnmount()
    }
  }, [componentState])

  const {key, ...otherProps} = componentState.get
  const {kind, component: Component} = data.model
  const useWrapperStyles = !data.model.isFeatureEnabled(cfDisableWrapperStyles)
  const containerClassName = cx(otherProps.className, useWrapperStyles && componentState.wrapperClassName)
  const containerStyle = useWrapperStyles ? componentState.wrapperStyle : undefined

  const Wrapper = componentWrapper ?? DefaultWrapper
  const Tooltip = data.store.tooltipProps ? TooltipWrapper : Fragment
  const ContainerComponent = componentWrapper ?? Component

  const useStyles = !data.model.isFeatureEnabled(cfDisableStyles)
  const className = useStyles ? containerClassName : undefined

  const ref = reactMajor >= 19 ? componentState.setRef : undefined

  if (kind === 'container') {
    return <ContainerComponent
      key={key}
      ref={ref}
      {...otherProps}
      className={className}
      {...containerStyle}
    />
  }

  if (kind === 'repeater') {
    return <Tooltip>
      <Wrapper>
        <Erroneous>
          <Component
            key={key}
            ref={ref}
            {...otherProps}
            wrapperClassName={className}
            {...containerStyle}
          />
        </Erroneous>
      </Wrapper>
    </Tooltip>
  }

  if (kind === 'template') {
    return <Wrapper className={className} {...containerStyle}>
      <Component key={key} ref={ref} {...otherProps}/>
    </Wrapper>
  }

  const wrapperClassName = useWrapperStyles ? componentState.wrapperClassName : undefined

  return <Tooltip>
    <Wrapper className={wrapperClassName} {...containerStyle}>
      <Erroneous>
        <Component key={key} ref={ref} {...otherProps}/>
      </Erroneous>
    </Wrapper>
  </Tooltip>
}

export const ComponentViewer = namedObserver('ComponentViewer', RawComponentViewer)
