import {MantineProvider} from '@mantine/core'
import React, {StrictMode, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Model, RendererFactory} from 'survey-core'
import {ReactQuestionFactory, Survey} from 'survey-react-ui'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@react-form-builder/bundle-size-shared/index.css'

import {
  MantineCheckboxQuestion,
  MantineCommentQuestion,
  MantineDropdownQuestion,
  MantineHtmlQuestion,
  MantineImageQuestion,
  MantineTagboxQuestion,
  MantineTextQuestion,
} from './mantine.tsx'
import './mantine.css'

import {json} from './booking-json.tsx'
import type {
  QuestionCheckboxModel,
  QuestionCommentModel,
  QuestionDropdownModel,
  QuestionHtmlModel,
  QuestionImageModel,
  QuestionTagboxModel,
  QuestionTextModel,
} from 'survey-core'

// Type assertion needed due to incorrect Survey.js TypeScript definitions
ReactQuestionFactory.Instance.registerQuestion('mantine-text', ((props: {question: QuestionTextModel}) =>
  React.createElement(MantineTextQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mantine-comment', ((props: {question: QuestionCommentModel}) =>
  React.createElement(MantineCommentQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mantine-dropdown', ((props: {question: QuestionDropdownModel}) =>
  React.createElement(MantineDropdownQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mantine-checkbox', ((props: {question: QuestionCheckboxModel}) =>
  React.createElement(MantineCheckboxQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mantine-tagbox', ((props: {question: QuestionTagboxModel}) =>
  React.createElement(MantineTagboxQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mantine-image', ((props: {question: QuestionImageModel}) =>
  React.createElement(MantineImageQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mantine-html', ((props: {question: QuestionHtmlModel}) =>
  React.createElement(MantineHtmlQuestion, props)) as unknown as (name: string) => React.ReactElement)

RendererFactory.Instance.registerRenderer('text', 'mantine-text', 'mantine-text', true)
RendererFactory.Instance.registerRenderer('comment', 'mantine-comment', 'mantine-comment', true)
RendererFactory.Instance.registerRenderer('dropdown', 'mantine-dropdown', 'mantine-dropdown', true)
RendererFactory.Instance.registerRenderer('checkbox', 'mantine-checkbox', 'mantine-checkbox', true)
RendererFactory.Instance.registerRenderer('tagbox', 'mantine-tagbox', 'mantine-tagbox', true)
RendererFactory.Instance.registerRenderer('image', 'mantine-image', 'mantine-image', true)
RendererFactory.Instance.registerRenderer('html', 'mantine-html', 'mantine-html', true)

function SurveyComponent() {
  const [survey] = useState<Model>(() => {
    const surveyModel = new Model(json)
    surveyModel.onComplete.add(sender => {
      console.warn(JSON.stringify(sender.data, null, 2))
    })
    return surveyModel
  })

  return <Survey model={survey} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <SurveyComponent />
    </MantineProvider>
  </StrictMode>
)
