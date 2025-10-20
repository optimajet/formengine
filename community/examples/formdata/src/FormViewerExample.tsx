import {faker} from '@faker-js/faker'
import {viewWithCss} from '@react-form-builder/components-rsuite'
import type {IFormData, IFormViewer} from '@react-form-builder/core'
import {ActionDefinition, ComponentData, FormViewer, isEqual} from '@react-form-builder/core'
import {ReactNode, useCallback, useRef, useState} from 'react'
import * as SampleForm from './SampleForm.json'

type AppState = {
  'First name': string;
  'Last name': string;
  'Email': string;
  'Message': string;
};

function generateData(): AppState {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({firstName, lastName})
  const message = faker.lorem.paragraph()

  return {
    'First name': firstName,
    'Last name': lastName,
    'Email': email,
    'Message': message
  }
}

const view = viewWithCss

const getForm = () => JSON.stringify(SampleForm)

let mockBackendStore = generateData()

type BackendResponse = {
  generated: number,
  data: AppState
}

const mockBackendGet = async (): Promise<BackendResponse> => {
  await new Promise(r => setTimeout(r, 300))

  return {
    generated: +new Date,
    data: mockBackendStore
  }
}

const mockBackendPost = async (data: any) => {
  await new Promise(r => setTimeout(r, 300))

  mockBackendStore = data

  return {
    status: 'success',
    data: mockBackendStore
  }
}

const getMessage = async () => {
  await new Promise(r => setTimeout(r, 1000))

  return faker.lorem.sentence()
}

const customActions = {
  submitForm: ActionDefinition.functionalAction(async (e) => {
    try {
      await e.store.formData.validate()
    } catch (e) {
      console.warn(e)
    }
    if (Object.keys(e.store.formData.errors).length < 1) {
      console.log(e.store.formData.data)
    } else {
      console.error(e.store.formData.errors)
    }
  }),
  suggestMessage: ActionDefinition.functionalAction(async (e) => {
    const message = await getMessage()

    e.data['Message'] = message
  }),
}

const EMPTY = {}

const Buttons = ({title, children}: { title: string, children: ReactNode }) =>
  (
    <div className={'fieldset'}>
      <span className={'legend'}>{title}</span>
      {children}
    </div>
  )

const State = ({state}: { state: AppState }) =>
  (
    <div className={'fieldset'}>
      <span className={'legend'}>App state</span>

      <div className={'field'}>
        <span className={'label'}>First name</span>
        <span className={'value'}>{state['First name']}</span>
      </div>

      <div className={'field'}>
        <span className={'label'}>Last name</span>
        <span className={'value'}>{state['Last name']}</span>
      </div>

      <div className={'field'}>
        <span className={'label'}>e-mail</span>
        <span className={'value'}>{state['Email']}</span>
      </div>

      <div className={'field'}>
        <span className={'label'}>Message</span>
        <span className={'value'}>{state['Message']}</span>
      </div>
    </div>
  )

const ObjectDump = ({obj, color, title}: { obj: any, color: string, title: string }) => (
  <div>
    <h3>{title}:</h3>
    <div style={{color}}>
      {obj && Object.entries(obj).map(([k, v]) => {
        return <p key={k}>{k} - {Array.isArray(v) ? v.join(', ') : v}</p>
      })}
    </div>
  </div>
)

/**
 * @returns the FormViewer example page component.
 */
export const FormViewerExample = () => {
  const [appLevelState, setAppLevelState] = useState<AppState>(generateData())
  const [appLevelErrors, setAppLevelErrors] = useState<Record<string, string | Array<string>>>(EMPTY)

  const [pendingChanges, setPendingChanges] = useState<Record<string, any>>(EMPTY)
  const havePendingChanges = Object.keys(pendingChanges).length > 0

  const renewAppData = useCallback(() => {
    setAppLevelState(generateData())
  }, [])

  const viewerRef = useRef<IFormViewer>(null)
  const processFormData = useCallback(async () => {
    const viewer = viewerRef.current

    if (viewer) {
      const formData = viewer.formData as IFormData
      const {data, errors} = formData
      const validation = await formData.getValidationResult()
      const withErrors = !!validation && Object.keys(validation).length > 0

      setAppLevelErrors(withErrors ? validation : EMPTY)

      console.log('Form data:\n', data)
      console.log('Form errors:\n', errors)
      console.log('Validation:\n', validation)
    }
  }, [])

  const onFormDataChanged = useCallback((formData: IFormData): void => {
    const {data, errors} = formData
    console.log('onFormDataChanged:\n', data, '\n', errors)

    setAppLevelState((prev) => {
      let next = {
        ...prev,
        ...data
      }

      return isEqual(next, prev) ? prev : next
    })

    setPendingChanges(prev => {
      const next = {...prev, ...data}

      return isEqual(prev, next) ? prev : next
    })
  }, [])

  const loadData = useCallback(async () => {
    const response = await mockBackendGet()

    // setAppLevelState(response.data)

    // another option is to set data directly
    const viewer = viewerRef.current
    if (viewer) {
      const formData = viewer.formData as ComponentData
      for (const key in response.data) {
        formData.updateInitialData(key, response.data[key as keyof AppState])
      }
    }

    setPendingChanges(EMPTY)
  }, [])

  const sendData = useCallback(async () => {
    if (havePendingChanges) {
      const result = await mockBackendPost(pendingChanges)

      if (result.status === 'success') {
        setPendingChanges(EMPTY)
      }
    }
  }, [havePendingChanges])

  const suggestMessage = useCallback(async () => {
    const Message = await getMessage()

    setAppLevelState((prevState: AppState) => {
      return {
        ...prevState,
        Message
      }
    })
  }, [])

  return <>
    <Buttons title={'Emulate backend'}>
      <button className={'button'} onClick={loadData}>Load</button>
      <button className={'button'} onClick={sendData} disabled={!havePendingChanges}>Send</button>
    </Buttons>

    <Buttons title={'Change initialData'}>
      <button className={'button'} onClick={renewAppData}>Recreate</button>
      <button className={'button'} onClick={suggestMessage}>Generate message</button>
    </Buttons>

    <State state={appLevelState}/>

    <div className={'fieldset'}>
      <span className={'legend'}>FormViewer</span>
      <FormViewer view={view} formName="SampleForm" getForm={getForm} onFormDataChange={onFormDataChanged} viewerRef={viewerRef}
                  initialData={appLevelState} actions={customActions}/>
    </div>

    <Buttons title={'Process form'}>
      <button className={'button'} onClick={processFormData}>Handle form data</button>
    </Buttons>

    <ObjectDump title={'Errors'} color={'red'} obj={appLevelErrors}/>

    <ObjectDump title={'Data'} color={'green'} obj={appLevelState}/>
  </>
}
