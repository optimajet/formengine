import type {Definer} from '@react-form-builder/core'
import {mtAutocomplete} from './components/MtAutocomplete'
import {mtButton} from './components/MtButton'
import {mtCheckbox} from './components/MtCheckbox'
import {mtCheckboxGroup} from './components/MtCheckboxGroup'
import {mtChip} from './components/MtChip'
import {mtChipCheckboxGroup, mtChipRadioGroup} from './components/MtChipGroup'
import {mtColorInput} from './components/MtColorInput'
import {mtColorPicker} from './components/MtColorPicker'
import {mtContainer} from './components/MtContainer'
import {mtDateMultiplePicker, mtDatePicker, mtDateRangePicker} from './components/MtDatePicker'
import {mtDateMultiplePickerInput, mtDatePickerInput, mtDateRangePickerInput} from './components/MtDatePickerInput'
import {mtDateTimePicker} from './components/MtDateTimePicker'
import {mtDialog} from './components/MtDialog'
import {mtDivider} from './components/MtDivider'
import {mtDropzone} from './components/MtDropzone'
import {mtErrorWrapper} from './components/MtErrorWrapper'
import {mtFileInput} from './components/MtFileInput'
import {mtJsonInput} from './components/MtJsonInput'
import {mtLabel} from './components/MtLabel'
import {mtMonthMultiplePicker, mtMonthPicker, mtMonthRangePicker} from './components/MtMonthPicker'
import {mtMonthMultiplePickerInput, mtMonthPickerInput, mtMonthRangePickerInput} from './components/MtMonthPickerInput'
import {mtMultiSelect} from './components/MtMultiSelect'
import {mtNativeSelect} from './components/MtNativeSelect'
import {mtNumberInput} from './components/MtNumberInput'
import {mtPasswordInput} from './components/MtPasswordInput'
import {mtRadio} from './components/MtRadio'
import {mtRadioGroup} from './components/MtRadioGroup'
import {mtRangeSlider} from './components/MtRangeSlider'
import {mtRating} from './components/MtRating'
import {mtSegmentedControl} from './components/MtSegmentedControl'
import {mtSelect} from './components/MtSelect'
import {mtSlider} from './components/MtSlider'
import {mtSwitch} from './components/MtSwitch'
import {mtSwitchGroup} from './components/MtSwitchGroup'
import {mtTagsInput} from './components/MtTagsInput'
import {mtText} from './components/MtText'
import {mtTextarea} from './components/MtTextarea'
import {mtTextInput} from './components/MtTextInput'
import {mtTimeGrid} from './components/MtTimeGrid'
import {mtTimeInput} from './components/MtTimeInput'
import {mtTimePicker} from './components/MtTimePicker'
import {mtTiptap} from './components/MtTiptap'
import {mtTitle} from './components/MtTitle'
import {mtTooltip} from './components/MtTooltip'
import {mtTypography} from './components/MtTypography'
import {mtYearMultiplePicker, mtYearPicker, mtYearRangePicker} from './components/MtYearPicker'
import {mtYearMultiplePickerInput, mtYearPickerInput, mtYearRangePickerInput} from './components/MtYearPickerInput'

/**
 * An array of Mantine component metadata factories.
 */
export const mantineComponentDefiners: Definer<any>[] = [
  // inputs
  mtCheckbox,
  mtCheckboxGroup,
  mtChip,
  mtChipCheckboxGroup,
  mtChipRadioGroup,
  mtColorInput,
  mtColorPicker,
  mtFileInput,
  mtJsonInput,
  mtLabel,
  mtNativeSelect,
  mtNumberInput,
  mtPasswordInput,
  mtRadio,
  mtRadioGroup,
  mtRangeSlider,
  mtRating,
  mtSegmentedControl,
  mtSlider,
  mtSwitch,
  mtSwitchGroup,
  mtTextInput,
  mtTextarea,
  // otherExtensions
  mtDropzone,
  mtTiptap,
  // combobox
  mtAutocomplete,
  mtMultiSelect,
  mtSelect,
  mtTagsInput,
  // dates
  mtDateMultiplePicker,
  mtDateMultiplePickerInput,
  mtDatePicker,
  mtDatePickerInput,
  mtDateRangePicker,
  mtDateRangePickerInput,
  mtDateTimePicker,
  mtMonthMultiplePicker,
  mtMonthMultiplePickerInput,
  mtMonthPicker,
  mtMonthPickerInput,
  mtMonthRangePicker,
  mtMonthRangePickerInput,
  mtTimeGrid,
  mtTimeInput,
  mtTimePicker,
  mtYearMultiplePicker,
  mtYearMultiplePickerInput,
  mtYearPicker,
  mtYearPickerInput,
  mtYearRangePicker,
  mtYearRangePickerInput,
  // buttons
  mtButton,
  // miscellaneous
  mtDivider,
  mtErrorWrapper,
  // overlays
  mtDialog,
  mtTooltip,
  // typography
  mtText,
  mtTitle,
  mtTypography,
  // layout
  mtContainer,
]
