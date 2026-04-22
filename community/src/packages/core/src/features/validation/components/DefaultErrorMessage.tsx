import cx from 'clsx'
import type {ReactNode} from 'react'
import {useBuilderTheme} from '../../../utils/contexts/BuilderThemeContext'
import {useAriaErrorMessage} from '../../../utils/useAriaAttributesIds'
import {addOrUpdateFeatures} from '../../define/utils/ComponentFeature'
import {cfComponentRole, cfHideFromComponentPalette} from '../../define/utils/integratedComponentFeatures'
import {Model} from '../../define/utils/Model'
import styles from './DefaultErrorMessage.module.css'

/**
 * Properties of the React component that wraps the form view component and displays validation errors.
 */
export interface ErrorWrapperProps {
  /**
   * The error text.
   */
  error?: string
  /**
   * The wrapped component.
   */
  children?: ReactNode
  /**
   * The CSS class name.
   */
  className?: string
}

const DefaultErrorMessage = ({children, error, className}: ErrorWrapperProps) => {
  const aria = useAriaErrorMessage()
  const darkTheme = useBuilderTheme() === 'dark'

  return (
    <div className={styles.errorContainer}>
      {children}
      {error && <p id={aria['aria-errormessage']} className={cx(className, styles.errorMessage, darkTheme && styles.dark)}>
        {error}
      </p>}
    </div>
  )
}
const typeName = 'DefaultErrorMessage'

const errorMessageFeatures = addOrUpdateFeatures({},
  {name: cfComponentRole, value: 'error-message'},
  {name: cfHideFromComponentPalette, value: true},
)

/**
 * The component metadata for error message. **Internal use only.**
 */
export const errorMessageModel = new Model(DefaultErrorMessage, typeName, undefined, undefined,
  undefined, undefined, undefined, undefined, typeName, undefined,
  undefined, undefined, undefined, undefined, undefined, errorMessageFeatures)
