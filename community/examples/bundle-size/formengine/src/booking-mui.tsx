import {Box, Button, Step, StepLabel, Stepper} from '@mui/material'
import {todayIso, tomorrowIso} from '@react-form-builder/bundle-size-shared/utils'
import {muiBox} from '@react-form-builder/components-material-ui/box'
import {muiButton} from '@react-form-builder/components-material-ui/button'
import {muiCheckbox} from '@react-form-builder/components-material-ui/checkbox'
import {muiContainer} from '@react-form-builder/components-material-ui/container'
import {muiErrorWrapper} from '@react-form-builder/components-material-ui/error-wrapper'
import {muiSelect} from '@react-form-builder/components-material-ui/select'
import {muiTextField} from '@react-form-builder/components-material-ui/text-field'
import {createView, define, FormViewer, type IFormData, type IFormViewer, string, useBuilderValue} from '@react-form-builder/core'
import {type ComponentProps, StrictMode, useCallback, useRef, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {bookingDetailsForm, travelerInfoForm} from './booking-form-mui.ts'

import {actions, formValidators} from './utils'

import '@react-form-builder/bundle-size-shared/index.css'

const MuiImage = ({alt, src, ...props}: ComponentProps<'img'>) => {
  const source = useBuilderValue(src, '')
  return <img {...props} alt={alt} src={source as string} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
}

const muiImage = define(MuiImage, 'MuiImage')
  .name('Image')
  .props({
    src: string.required.default('').dataBound,
    alt: string.default('Room preview'),
  })

type MuiStaticHtmlProps = ComponentProps<'div'> & {
  content: string
}

const MuiStaticHtml = ({content, ...props}: MuiStaticHtmlProps) => {
  const value = useBuilderValue(content, '') as string
  return <div {...props} dangerouslySetInnerHTML={{__html: value}} />
}

const muiStaticHtml = define(MuiStaticHtml, 'MuiStaticHtml')
  .name('Static content')
  .props({
    content: string.required.default('').dataBound,
  })

const components = [muiContainer, muiTextField, muiButton, muiErrorWrapper, muiSelect, muiCheckbox, muiBox, muiImage, muiStaticHtml].map(
  def => def.build().model
)

const view = createView(components)

const steps = ['Booking Details', 'Traveler Info']

export const App = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [stepData, setStepData] = useState<[Record<string, unknown>, Record<string, unknown>]>([
    {
      'check-in-date': todayIso(),
      'check-out-date': tomorrowIso(),
      'number-of-guests': 2,
      'room-type': 'queen',
      'non-smoking': false,
      'number-of-rooms': 1,
      'with-pets': false,
      extras: '',
      notes: '',
    },
    {},
  ])

  const viewerRef = useRef<IFormViewer>(null)

  const getForm = useCallback(() => {
    return activeStep === 0 ? bookingDetailsForm : travelerInfoForm
  }, [activeStep])

  const getInitialData = useCallback(() => {
    return stepData[activeStep]
  }, [activeStep, stepData])

  const handleNext = useCallback(async () => {
    const viewer = viewerRef.current
    if (viewer) {
      const formData = viewer.formData as IFormData
      await formData.validate()
      if (formData.hasErrors) {
        return
      }
      setStepData(prev => {
        const newData = [...prev] as [Record<string, unknown>, Record<string, unknown>]
        newData[activeStep] = formData.data
        return newData
      })
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }, [activeStep])

  const handleBack = useCallback(() => {
    const viewer = viewerRef.current
    if (viewer) {
      const formData = viewer.formData as IFormData
      setStepData(prev => {
        const newData = [...prev] as [Record<string, unknown>, Record<string, unknown>]
        newData[activeStep] = formData.data
        return newData
      })
    }
    setActiveStep(prev => Math.max(prev - 1, 0))
  }, [activeStep])

  const handleFinish = useCallback(async () => {
    const viewer = viewerRef.current
    if (viewer) {
      const formData = viewer.formData as IFormData
      await formData.validate()
      if (formData.hasErrors) {
        return
      }
      const finalData = {...stepData[0], ...stepData[1], ...formData.data}
      console.warn('Booking data', finalData)
    }
  }, [stepData])

  const isLastStep = activeStep === steps.length - 1

  return (
    <div>
      <Stepper activeStep={activeStep} sx={{mb: 4, mt: 2}}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
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
      <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 3}}>
        <Button disabled={activeStep === 0} onClick={handleBack}>
          Booking Details
        </Button>
        <Button variant="contained" color="primary" onClick={isLastStep ? handleFinish : handleNext}>
          {isLastStep ? 'Book Now' : 'Traveler Info ➝'}
        </Button>
      </Box>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)

root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
