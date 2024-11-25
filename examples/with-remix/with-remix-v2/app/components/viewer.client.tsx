import {ReactNode, useMemo} from 'react'
import {
  formEngineRsuiteCssLoader,
  ltrCssLoader,
  RsLocalizationWrapper,
  rSuiteComponents,
  rsErrorMessage,
  rtlCssLoader
} from '@react-form-builder/components-rsuite'
import {ActionDefinition, BiDi, createView, FormViewer} from '@react-form-builder/core'
import {IFormStorage} from '@react-form-builder/designer'

import {Message, MessageProvider, useMessage} from '~/components/message'
import form from '~/common/form.json'
import {customValidators} from '~/common/validators'

const viewerComponents = rSuiteComponents.map(c => c.build().model)
viewerComponents.push(rsErrorMessage.build().model)

const formName = 'nextForm'

const formStorage: IFormStorage = {
  getForm: async () => localStorage.getItem(formName) || JSON.stringify(form),
  saveForm: async (_, form) => localStorage.setItem(formName, form),
  getFormNames: () => Promise.resolve([formName]),
  removeForm: () => Promise.resolve()
}

const loadForm = () => formStorage.getForm('')

const view = createView(viewerComponents)
  .withViewerWrapper(RsLocalizationWrapper)
  .withCssLoader(BiDi.LTR, ltrCssLoader)
  .withCssLoader(BiDi.RTL, rtlCssLoader)
  .withCssLoader('common', formEngineRsuiteCssLoader)

const ViewerWrap = ({children}: { children: ReactNode }) => (
  <MessageProvider>
    {children}
    <Message/>
  </MessageProvider>
)

const ViewerInner = () => {
  const {open, setOpen} = useMessage()

  const actions = useMemo(() => ({
    submitForm: ActionDefinition.functionalAction(async (e) => {
      const formData = e.store.formData

      setOpen(false)

      try {
        await formData.validate()
      } catch (e) {
        open(String(e))
      }
      if (Object.keys(formData.errors).length < 1) {
        open('Thank you!')
      } else {
        const message = Object.entries<string>(formData.errors).reduce<Array<string>>((acc, [k, v]) => {
          acc.push([k, v].join(' - '))
          return acc
        }, []).join('<br/>')
        open(message)
      }
    })
  }), [open, setOpen])

  return (
    <FormViewer
      view={view}
      actions={actions}
      formName={formName}
      getForm={loadForm}
      validators={customValidators}
    />
  )
}

export default function ViewerClient() {
  return <div className="grid h-screen place-items-center">
    <div className="max-w-[600px]">
      <ViewerWrap>
        <ViewerInner/>
      </ViewerWrap>
    </div>
  </div>
}
