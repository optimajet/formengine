import CssBaseline from '@mui/material/CssBaseline'
import {ThemeProvider} from '@mui/material/styles'
import React, {StrictMode, useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Model, RendererFactory} from 'survey-core'
import {ReactQuestionFactory, Survey} from 'survey-react-ui'

import '@react-form-builder/bundle-size-shared/index.css'

import {
  MuiCheckboxQuestion,
  MuiCommentQuestion,
  MuiDropdownQuestion,
  MuiHtmlQuestion,
  MuiImageQuestion,
  MuiTagboxQuestion,
  MuiTextQuestion,
  theme,
} from './mui.tsx'
import './mui.css'

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
ReactQuestionFactory.Instance.registerQuestion('mui-text', ((props: {question: QuestionTextModel}) =>
  React.createElement(MuiTextQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mui-comment', ((props: {question: QuestionCommentModel}) =>
  React.createElement(MuiCommentQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mui-dropdown', ((props: {question: QuestionDropdownModel}) =>
  React.createElement(MuiDropdownQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mui-checkbox', ((props: {question: QuestionCheckboxModel}) =>
  React.createElement(MuiCheckboxQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mui-tagbox', ((props: {question: QuestionTagboxModel}) =>
  React.createElement(MuiTagboxQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mui-image', ((props: {question: QuestionImageModel}) =>
  React.createElement(MuiImageQuestion, props)) as unknown as (name: string) => React.ReactElement)
ReactQuestionFactory.Instance.registerQuestion('mui-html', ((props: {question: QuestionHtmlModel}) =>
  React.createElement(MuiHtmlQuestion, props)) as unknown as (name: string) => React.ReactElement)

RendererFactory.Instance.registerRenderer('text', 'mui-text', 'mui-text', true)
RendererFactory.Instance.registerRenderer('comment', 'mui-comment', 'mui-comment', true)
RendererFactory.Instance.registerRenderer('dropdown', 'mui-dropdown', 'mui-dropdown', true)
RendererFactory.Instance.registerRenderer('checkbox', 'mui-checkbox', 'mui-checkbox', true)
RendererFactory.Instance.registerRenderer('tagbox', 'mui-tagbox', 'mui-tagbox', true)
RendererFactory.Instance.registerRenderer('image', 'mui-image', 'mui-image', true)
RendererFactory.Instance.registerRenderer('html', 'mui-html', 'mui-html', true)

function SurveyComponent() {
  const [survey, setSurvey] = useState<Model | null>(null)

  useEffect(() => {
    const surveyModel = new Model(json)

    surveyModel.onComplete.add(sender => {
      console.warn(JSON.stringify(sender.data, null, 2))
    })

    setSurvey(surveyModel)
  }, [])

  if (!survey) return null

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Survey model={survey} />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyComponent />
  </StrictMode>
)
