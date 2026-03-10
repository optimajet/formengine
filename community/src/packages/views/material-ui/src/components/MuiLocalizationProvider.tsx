import {LocalizationProvider} from '@mui/x-date-pickers'
// eslint-disable-next-line import/extensions
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
import type {FormViewerWrapper} from '@react-form-builder/core'

/**
 * Wrapper component for Material UI components localization.
 * @param props the FormViewerWrapper props.
 * @returns the React context provider.
 */
export const MuiLocalizationProvider: FormViewerWrapper = (props) => {
  return <LocalizationProvider dateAdapter={AdapterDayjs}
                               adapterLocale={props.language.code ?? 'en'}>{props.children}</LocalizationProvider>
}
