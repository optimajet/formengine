import RawAgreementForm from './agreement.json'
import RawMuiForm from './MuiForm.json'
import RawRSuiteForm from './RSuiteForm.json'
import RawTemplateForm from './template.json'

export const MuiForm = JSON.stringify(RawMuiForm)
export const RSuiteForm = JSON.stringify(RawRSuiteForm)
export const template = JSON.stringify(RawTemplateForm)
export const agreement = JSON.stringify(RawAgreementForm)

export const forms: Record<string, any> = {MuiForm, RSuiteForm, template, agreement}
