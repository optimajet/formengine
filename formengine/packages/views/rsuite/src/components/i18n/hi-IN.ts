import dfHI from 'date-fns/locale/hi/index.js'
import hiInLocale from './locales/hi-IN.json'
import {patchPlaceholders} from './patchPlaceholders'

const locale = patchPlaceholders(hiInLocale)

const genericDateTimeFormats = {
  ...locale.genericDateTimeFormats,
  formattedMonthPattern: 'MMM, yyyy',
  formattedDayPattern: 'MMM dd, yyyy',
  shortDateFormat: 'dd/MM/yyyy',
  shortTimeFormat: 'h:mm a',
  dateLocale: dfHI
}

const genericCreatableComboBox = {
  ...locale.genericCombobox,
  ...locale.genericCreatableComboBox,
}

export const hiIN = patchPlaceholders({
  code: 'hi-IN',
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
