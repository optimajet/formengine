import {cx} from '@emotion/css'
import {Fragment, useEffect} from 'react'
import {namedObserver} from '../../utils'
import {useComponentData} from '../../utils/contexts/ComponentDataContext'
import {useViewerProps} from '../form-viewer/components/ViewerPropsContext'
import {TooltipWrapper} from '../tooltip/TooltipWrapper'
import {Erroneous} from '../validation'
import {DefaultWrapper} from './DefaultWrapper'

const RawComponentViewer = () => {
  const data = useComponentData()
  const {componentWrapper} = useViewerProps()

  const componentState = data.componentState

  useEffect(() => {
    componentState.onDidMount()
    return () => {
      componentState.onWillUnmount()
    }
  }, [componentState])

  const {key, ...otherProps} = componentState.get
  const {kind, component: Component} = data.model
  const containerClassName = cx(otherProps.className, componentState.wrapperClassName)
  const containerStyle = componentState.wrapperStyle

  const Wrapper = componentWrapper ?? DefaultWrapper
  const Tooltip = data.store.tooltipProps ? TooltipWrapper : Fragment
  const ContainerComponent = componentWrapper ?? Component
  const component = <Component key={key} {...otherProps}/>

  if (kind === 'container') {
    return <ContainerComponent key={key} {...otherProps} className={containerClassName} {...containerStyle}/>
  }

  if (kind === 'repeater') {
    return <Wrapper><Tooltip><Erroneous>
      <Component key={key} {...otherProps} wrapperClassName={containerClassName} {...containerStyle}/>
    </Erroneous></Tooltip></Wrapper>
  }

  return <Wrapper className={kind === 'template' ? containerClassName : componentState.wrapperClassName} {...containerStyle}>
    {kind === 'template'
      ? component
      : <Tooltip><Erroneous>{component}</Erroneous></Tooltip>
    }
  </Wrapper>
}

export const ComponentViewer = namedObserver('ComponentViewer', RawComponentViewer)
