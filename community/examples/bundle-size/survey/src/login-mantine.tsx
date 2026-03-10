import {Button, Checkbox, Stack, TextInput, Title, MantineProvider} from '@mantine/core'
import {StrictMode, useCallback, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Model, Question, QuestionTextModel} from 'survey-core'
import {json} from './login-json.tsx'

import '@mantine/core/styles/baseline.css'
import '@mantine/core/styles/default-css-variables.css'
import '@mantine/core/styles/global.css'
import '@mantine/core/styles/ActionIcon.css'
import '@mantine/core/styles/Button.css'
import '@mantine/core/styles/Checkbox.css'
import '@mantine/core/styles/Input.css'
import '@mantine/core/styles/SimpleGrid.css'
import '@mantine/core/styles/Title.css'
import '@mantine/core/styles/PasswordInput.css'
import '@react-form-builder/bundle-size-shared/index.css'

function renderQuestion(question: Question) {
  const type = question.getType()

  if (type === 'text') {
    const textQuestion = question as QuestionTextModel
    return (
      <TextInput
        key={question.name}
        mt="sm"
        label={String(question.title)}
        type={textQuestion.inputType || 'text'}
        required={question.isRequired}
        value={(question.value as string) ?? ''}
        error={question.hasErrors() ? question.errors?.[0]?.text : null}
        onChange={event => (question.value = event.currentTarget.value)}
      />
    )
  }

  if (type === 'boolean') {
    return (
      <Checkbox
        key={question.name}
        mt="sm"
        checked={Boolean(question.value)}
        label={String(question.title)}
        onChange={event => (question.value = event.currentTarget.checked)}
      />
    )
  }

  return null
}

function SurveyComponent() {
  const [, forceUpdate] = useState(0)
  const [survey] = useState<Model>(() => {
    const surveyModel = new Model(json)
    surveyModel.onValueChanged.add(() => forceUpdate(x => ++x))
    return surveyModel
  })

  const submit = useCallback(() => {
    console.warn('Form data', survey?.data)
  }, [survey])

  return (
    <Stack>
      <Title order={3}>{String(survey.title)}</Title>
      {survey.currentPage.elements.map(renderQuestion)}
      <Button fullWidth onClick={submit}>
        Login
      </Button>
    </Stack>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <SurveyComponent />
    </MantineProvider>
  </StrictMode>
)
