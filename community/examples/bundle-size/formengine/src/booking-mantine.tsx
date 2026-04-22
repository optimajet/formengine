import {Box, Button, Group, MantineProvider, Stepper} from '@mantine/core'
import {today, tomorrow} from '@react-form-builder/bundle-size-shared/utils'
import {mtCheckbox} from '@react-form-builder/components-mantine/checkbox'
import {mtContainer} from '@react-form-builder/components-mantine/container'
import {mtDatePickerInput} from '@react-form-builder/components-mantine/datePickerInput'
import {mtErrorWrapper} from '@react-form-builder/components-mantine/errorWrapper'
import {mtSelect} from '@react-form-builder/components-mantine/select'
import {mtTextarea} from '@react-form-builder/components-mantine/textarea'
import {mtTextInput} from '@react-form-builder/components-mantine/textInput'
import {createView, define, FormViewer, type IFormData, type IFormViewer, string, useBuilderValue} from '@react-form-builder/core'
import {type ComponentProps, StrictMode, useCallback, useRef, useState} from 'react'
import {createRoot} from 'react-dom/client'

import '@react-form-builder/core/assets/styles.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@react-form-builder/bundle-size-shared/index.css'
import {bookingDetailsFormMantine, travelerInfoFormMantine} from './booking-form-mantine.ts'
import {actions, formValidators} from './utils'

const MtImage = ({alt, src, ...props}: ComponentProps<'img'>) => {
  const source = useBuilderValue(src, '')
  return <img {...props} alt={alt} src={source as string} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
}

const mtImage = define(MtImage, 'MtImage')
  .name('Image')
  .props({
    src: string.required.default('').dataBound,
    alt: string.default('Room preview'),
  })

const components = [mtContainer, mtDatePickerInput, mtSelect, mtCheckbox, mtTextarea, mtTextInput, mtErrorWrapper, mtImage].map(
  def => def.build().model
)

const view = createView(components)

const steps = ['Booking Details', 'Traveler Info']

const App = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [stepData, setStepData] = useState<[Record<string, unknown>, Record<string, unknown>]>([
    {
      'check-in-date': today(),
      'check-out-date': tomorrow(),
      'number-of-guests': '2',
      'room-type': 'queen',
      'non-smoking': false,
      notes: '',
    },
    {},
  ])

  const viewerRef = useRef<IFormViewer>(null)

  const getForm = useCallback(() => {
    return activeStep === 0 ? bookingDetailsFormMantine : travelerInfoFormMantine
  }, [activeStep])

  const getInitialData = useCallback(() => {
    return stepData[activeStep]
  }, [activeStep, stepData])

  const handleNext = useCallback(async () => {
    const viewer = viewerRef.current
    if (!viewer) {
      return
    }
    const formData = viewer.formData as IFormData
    await formData.validate()
    if (formData.hasErrors) {
      return
    }
    setStepData(prev => {
      const nextData = [...prev] as [Record<string, unknown>, Record<string, unknown>]
      nextData[activeStep] = formData.data
      return nextData
    })
    setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
  }, [activeStep])

  const handleBack = useCallback(() => {
    const viewer = viewerRef.current
    if (viewer) {
      const formData = viewer.formData as IFormData
      setStepData(prev => {
        const nextData = [...prev] as [Record<string, unknown>, Record<string, unknown>]
        nextData[activeStep] = formData.data
        return nextData
      })
    }
    setActiveStep(prev => Math.max(prev - 1, 0))
  }, [activeStep])

  const handleFinish = useCallback(async () => {
    const viewer = viewerRef.current
    if (!viewer) {
      return
    }
    const formData = viewer.formData as IFormData
    await formData.validate()
    if (formData.hasErrors) {
      return
    }
    const finalData = {...stepData[0], ...stepData[1], ...formData.data}
    console.warn('Booking data', finalData)
  }, [stepData])

  const isLastStep = activeStep === steps.length - 1

  return (
    <MantineProvider>
      <Stepper active={activeStep} mb="lg">
        {steps.map(label => (
          <Stepper.Step key={label} label={label} />
        ))}
      </Stepper>
      <FormViewer
        key={activeStep}
        view={view}
        getForm={getForm}
        actions={actions}
        viewerRef={viewerRef}
        initialData={getInitialData()}
        formValidators={formValidators}
      />
      <Box mt="md">
        <Group justify="space-between">
          <Button variant="default" disabled={activeStep === 0} onClick={handleBack}>
            Booking Details
          </Button>
          <Button onClick={isLastStep ? handleFinish : handleNext}>{isLastStep ? 'Book Now' : 'Traveler Info ->'}</Button>
        </Group>
      </Box>
    </MantineProvider>
  )
}

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App/>
  </StrictMode>
)
