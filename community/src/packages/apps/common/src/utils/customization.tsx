import type {CustomizationMap} from '@react-form-builder/designer'
import type {PropsWithChildren, ReactElement, ReactNode} from 'react'
import {Fragment} from 'react'
import {Version} from '../components/Version'

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const Wrapper = ({children}: PropsWithChildren): ReactElement | ReactNode => <div style={containerStyle}>{children}</div>

/**
 * Add an element to the default element.
 * @param element the element to add to the default element.
 * @param WrapperComponent the wrapper component to use.
 * @returns the customized element.
 */
export const addToDefaultElement = (element: ReactNode, WrapperComponent = Wrapper): CustomizationMap[string] => ({
  customRenderer: defaultElement => (
    <WrapperComponent>
      {defaultElement}
      {element}
    </WrapperComponent>
  ),
})

/**
 * Customization map for the form builder UI.
 */
export const customization: CustomizationMap = {
  MainMenu_Items: addToDefaultElement(<Version />, Fragment),
}
