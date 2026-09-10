import type {FormViewerWrapper} from '@react-form-builder/core'
import {BiDi} from '@react-form-builder/core'
import {useContext} from 'react'
import {CustomContext} from 'rsuite/esm/CustomProvider/CustomContext.js'
import CustomProvider from 'rsuite/esm/CustomProvider/CustomProvider.js'
import {
  arEG,
  daDK,
  deDE,
  enGB,
  enUS,
  esAR,
  esES,
  fiFI,
  frFR,
  huHU,
  itIT,
  jaJP,
  kkKZ,
  koKR,
  nlNL,
  ptBR,
  svSE,
  trTR,
  zhCN,
  zhTW
} from 'rsuite/esm/locales/index.js'
import {hiIN} from './i18n/hi-IN'
import {srRS} from './i18n/sr-RS'

const rSuiteLocales: Record<string, any> = {
  'ar-EG': arEG,
  'de-DE': deDE,
  'en-US': enUS,
  'it-IT': itIT,
  'fr-FR': frFR,
  'es-ES': esES,
  'zh-CN': zhCN,
  'da-DK': daDK,
  'en-GB': enGB,
  'es-AR': esAR,
  'fi-FI': fiFI,
  'hi-IN': hiIN,
  'hu-HU': huHU,
  'kk-KZ': kkKZ,
  'ko-KR': koKR,
  'nl-NL': nlNL,
  'pt-BR': ptBR,
  'sr-RS': srRS,
  'sv-SE': svSE,
  'tr-TR': trTR,
  'zh-TW': zhTW,
  'ja-JP': jaJP,
}

export const defaultComponentsLocale = enUS

/**
 * Wrapper component for RSuite components localization and text direction.
 * Use this for FormViewer when you only need locale and RTL support.
 * For FormBuilder, or FormViewer with light/dark theming, use {@link RsViewWrapper} instead.
 * @param props the FormViewerWrapper props.
 * @returns the wrapped components with localization settings applied.
 */
export const RsLocalizationWrapper: FormViewerWrapper = (props) => {
  const {language, children} = props
  const parent = useContext(CustomContext)
  const locale = rSuiteLocales[language.fullCode] ?? defaultComponentsLocale
  return (
    <CustomProvider {...parent} rtl={language.bidi === BiDi.RTL} locale={locale}>
      {children}
    </CustomProvider>
  )
}
