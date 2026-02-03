import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {StrictMode, useCallback, useEffect, useState} from 'react'
import {createRoot} from 'react-dom/client'
import {Model, Question, QuestionTextModel} from 'survey-core'
import {json} from './login-json.tsx'

import '@react-form-builder/bundle-size-shared/index.css'

function renderQuestion(q: Question) {
  const type = q.getType()

  if (type === 'text') {
    const tq = q as QuestionTextModel
    return (
      <TextField
        key={q.name}
        fullWidth
        margin="normal"
        label={q.title}
        type={tq.inputType || 'text'}
        required={q.isRequired}
        value={(q.value as string) ?? ''}
        error={q.hasErrors()}
        helperText={q.errors?.[0]?.text}
        onChange={e => (q.value = e.target.value)}
      />
    )
  }

  if (type === 'boolean') {
    return (
      <FormControlLabel
        key={q.name}
        control={<Checkbox checked={Boolean(q.value)} onChange={e => (q.value = e.target.checked)} />}
        label={q.title}
      />
    )
  }

  return null
}

const muiTheme = createTheme({
  palette: {
    primary: {main: '#1976d2'},
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
})

function SurveyComponent() {
  const [survey, setSurvey] = useState<Model | null>(null)
  const [, forceUpdate] = useState(0)

  const submit = useCallback(() => {
    console.warn('Form data', survey?.data)
  }, [survey])

  useEffect(() => {
    const survey = new Model(json)

    survey.onValueChanged.add(() => forceUpdate(x => ++x))

    setSurvey(survey)
  }, [])

  if (!survey) return null

  return (
    <ThemeProvider theme={muiTheme}>
      <Typography variant="h5" gutterBottom>
        {survey.title}
      </Typography>

      {survey.currentPage.elements.map(renderQuestion)}

      <Button fullWidth variant="contained" onClick={submit}>
        Login
      </Button>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SurveyComponent />
  </StrictMode>
)
