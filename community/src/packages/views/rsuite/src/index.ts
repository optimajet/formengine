import type {Definer} from '@react-form-builder/core'
import {createView} from '@react-form-builder/core'
import {BiDi, BuilderView} from '@react-form-builder/core'
import {rsAutoComplete} from './components/RsAutocomplete'
import {rsBreadcrumb} from './components/RsBreadcrumb'
import {rsButton} from './components/RsButton'
import {rsCalendar} from './components/RsCalendar'
import {rsCard} from './components/RsCard'
import {rsCheckbox} from './components/RsCheckbox'
import {rsContainer} from './components/RsContainer'
import {rsDatePicker} from './components/RsDatePicker'
import {rsDropdown} from './components/RsDropdown'
import type {RsErrorMessageProps} from './components/RsErrorMessage'
import {rsErrorMessage} from './components/RsErrorMessage'
import {rsHeader} from './components/RsHeader'
import {rsImage} from './components/RsImage'
import {rsInput} from './components/RsInput'
import {rsLabel} from './components/RsLabel'
import {rsLink} from './components/RsLink'
import {RsLocalizationWrapper} from './components/RsLocalizationWrapper'
import {rsMenu} from './components/RsMenu'
import {rsMessage} from './components/RsMessage'
import {rsNumberFormat} from './components/RsNumberFormat'
import {rsPatternFormat} from './components/RsPatternFormat'
import {rsProgressCircle, rsProgressLine} from './components/RsProgress'
import {rsRadioGroup} from './components/RsRadioGroup'
import {rsSearch} from './components/RsSearch'
import {rsStaticContent} from './components/RsStaticContent'
import {rsTab} from './components/RsTab'
import {rsTagPicker} from './components/RsTagPicker'
import {rsTextArea} from './components/RsTextArea'
import {rsTimePicker} from './components/RsTimePicker'
import {rsToggle} from './components/RsToggle'
import type {RsTooltipProps} from './components/RsTooltip'
import {rsTooltip} from './components/RsTooltip'
import {rsUploader} from './components/RsUploader'
import {rsWizard} from './components/RsWizard/RsWizard'
import {rsWizardStep} from './components/RsWizard/RsWizardStep'
import {formEngineRsuiteCssLoader, ltrCssLoader, rtlCssLoader} from './cssLoader'

const categories = {
  fields: [
    rsAutoComplete,
    rsCalendar,
    rsCheckbox,
    rsDatePicker,
    rsTimePicker,
    rsDropdown,
    rsInput,
    rsNumberFormat,
    rsPatternFormat,
    rsRadioGroup,
    rsSearch,
    rsTagPicker,
    rsTextArea,
    rsToggle,
    rsUploader
  ],
  static: [
    rsButton,
    rsErrorMessage,
    rsHeader,
    rsImage,
    rsLabel,
    rsMenu,
    rsMessage,
    rsProgressCircle,
    rsProgressLine,
    rsStaticContent,
    rsTooltip,
    rsLink,
  ],
  structure: [
    rsBreadcrumb,
    rsCard,
    rsContainer,
    rsTab,
    rsWizard,
    rsWizardStep
  ],
}

/**
 * An array of rSuite component metadata factories.
 */
const rSuiteComponents: Definer<any>[] = []

const prefix = 'Rs'
Object.entries(categories).forEach(([category, components]) => {
  components.forEach(c => {
    if (!c.getType().startsWith(prefix)) {
      throw new Error(`The component type must start with '${prefix}', type: '${c.getType()}'`)
    }
    c.category(category)
    rSuiteComponents.push(c)
  })
})

export {rSuiteComponents, rsErrorMessage, rsTooltip, RsLocalizationWrapper, rtlCssLoader, ltrCssLoader, formEngineRsuiteCssLoader}
export type {RsErrorMessageProps, RsTooltipProps}

const components = rSuiteComponents.map(def => def.build())

/**
 * An array of rSuite component metadata for use in FormViewer.
 */
export const models = components.map(({model}) => model)

/**
 * An assembled set of rSuite components, ready to be passed as a property to the FormViewer.
 */
export const view = createView(models)

/**
 * An assembled set of rSuite components, ready to be passed as a property to the FormViewer.
 * This view contains CSS loaders.
 */
export const viewWithCss = createView(models)
  // The following parameters are required for correct CSS loading in LTR and RTL modes
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)

/**
 * An assembled set of rSuite components metadata, ready to be passed as a property to the FormBuilder.
 * This view contains CSS loaders.
 */
export const builderViewWithCss = new BuilderView(components)
  .withErrorMeta(rsErrorMessage.build())
  .withTooltipMeta(rsTooltip.build())
  .withTemplates([])
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)
