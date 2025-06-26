import dfSR from 'date-fns/locale/sr/index.js'
import srRsLocale from './locales/sr-RS.json'
import {patchPlaceholders} from './patchPlaceholders'

const locale = patchPlaceholders(srRsLocale)

const genericDateTimeFormats = {
  ...locale.genericDateTimeFormats,
  formattedMonthPattern: 'MMM, yyyy',
  formattedDayPattern: 'MMM dd, yyyy',
  shortDateFormat: 'MM/dd/yyyy',
  shortTimeFormat: 'hh:mm aa',
  dateLocale: dfSR
}

const genericCreatableComboBox = {
  ...locale.genericCombobox,
  ...locale.genericCreatableComboBox,
}

export const srRS = patchPlaceholders({
  code: 'sr-RS',
  common: locale.default.common,
  Plaintext: locale.default.Plaintext,
  Pagination: locale.default.Pagination,
  DateTimeFormats: genericDateTimeFormats,
  Calendar: genericDateTimeFormats,
  DatePicker: genericDateTimeFormats,
  DateRangePicker: {
    ...genericDateTimeFormats,
    ...locale.default.DateRangePicker,
  },
  Combobox: {
    ...locale.genericCombobox
  },
  InputPicker: genericCreatableComboBox,
  TagPicker: genericCreatableComboBox,
  Uploader: locale.default.Uploader,
  CloseButton: locale.default.CloseButton,
  Breadcrumb: locale.default.Breadcrumb,
  Toggle: locale.default.Toggle,
})
