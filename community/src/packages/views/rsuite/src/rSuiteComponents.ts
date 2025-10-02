import type {Definer} from '@react-form-builder/core'
import {rsAutoComplete} from './components/RsAutocomplete'
import {rsBreadcrumb} from './components/RsBreadcrumb'
import {rsButton} from './components/RsButton'
import {rsCalendar} from './components/RsCalendar'
import {rsCard} from './components/RsCard'
import {rsCheckbox} from './components/RsCheckbox'
import {rsContainer} from './components/RsContainer'
import {rsDatePicker} from './components/RsDatePicker'
import {rsDivider} from './components/RsDivider'
import {rsDropdown} from './components/RsDropdown'
import {rsErrorMessage} from './components/RsErrorMessage'
import {rsHeader} from './components/RsHeader'
import {rsImage} from './components/RsImage'
import {rsInput} from './components/RsInput'
import {rsLabel} from './components/RsLabel'
import {rsLink} from './components/RsLink'
import {rsMenu} from './components/RsMenu'
import {rsMessage} from './components/RsMessage'
import {rsModal} from './components/RsModal'
import {rsModalLayout} from './components/RsModalLayout'
import {rsNumberFormat} from './components/RsNumberFormat'
import {rsPatternFormat} from './components/RsPatternFormat'
import {rsPlaceholderGraph, rsPlaceholderGrid, rsPlaceholderParagraph} from './components/RsPlaceholder'
import {rsProgressCircle, rsProgressLine} from './components/RsProgress'
import {rsRadioGroup} from './components/RsRadioGroup'
import {rsSearch} from './components/RsSearch'
import {rsStaticContent} from './components/RsStaticContent'
import {rsTab} from './components/RsTab'
import {rsTagPicker} from './components/RsTagPicker'
import {rsTextArea} from './components/RsTextArea'
import {rsTimePicker} from './components/RsTimePicker'
import {rsToggle} from './components/RsToggle'
import {rsTooltip} from './components/RsTooltip'
import {rsUploader} from './components/RsUploader'
import {rsWizard} from './components/RsWizard/RsWizard'
import {rsWizardStep} from './components/RsWizard/RsWizardStep'

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
    rsDivider,
    rsHeader,
    rsImage,
    rsLabel,
    rsMenu,
    rsMessage,
    rsPlaceholderGraph,
    rsPlaceholderGrid,
    rsPlaceholderParagraph,
    rsProgressCircle,
    rsProgressLine,
    rsStaticContent,
    rsTooltip,
    rsLink,
  ],
  modal: [
    rsModal,
    rsModalLayout,
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
    if (c.data.category !== category) {
      throw new Error(`Incorrect component '${c.getType()}' category, expected '${category}', current category '${c.data.category}'.`)
    }
    rSuiteComponents.push(c)
  })
})

export {rSuiteComponents}
