import Box from '@mui/material/Box'
// import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import {createTheme} from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import {
  QuestionCheckboxModel,
  QuestionCommentModel,
  QuestionDropdownModel,
  QuestionHtmlModel,
  QuestionImageModel,
  QuestionTagboxModel,
  QuestionTextModel,
} from 'survey-core'

type QuestionProps<T> = {question: T}

export const MuiTextQuestion = ({question: q}: QuestionProps<QuestionTextModel>) => {
  if (!q.isVisible) {
    return null
  }

  return (
    <TextField
      sx={{width: q.width || '100%', minWidth: q.minWidth}}
      margin="normal"
      type={q.inputType || 'text'}
      label={q.titleLocation === 'hidden' ? undefined : q.title}
      placeholder={q.placeholder}
      value={(q.value as string) ?? ''}
      error={q.hasErrors()}
      // helperText={q.errors?.[0]?.text || q.description}
      onChange={e => {
        q.value = e.target.value
      }}
    />
  )
}

export const MuiCommentQuestion = ({question: q}: QuestionProps<QuestionCommentModel>) => {
  if (!q?.isVisible) {
    return null
  }

  return (
    <TextField
      sx={{width: q.width || '100%', minWidth: q.minWidth}}
      margin="normal"
      multiline
      minRows={3}
      placeholder={q.placeholder}
      value={(q.value as string) ?? ''}
      onChange={e => (q.value = e.target.value)}
    />
  )
}

export const MuiDropdownQuestion = ({question: q}: QuestionProps<QuestionDropdownModel>) => {
  if (!q?.isVisible) {
    return null
  }

  return (
    <TextField
      sx={{width: q.width || '100%', minWidth: q.minWidth}}
      select
      margin="normal"
      value={q.value ?? ''}
      placeholder={q.placeholder}
      onChange={e => {
        q.value = e.target.value
      }}
    >
      {q.visibleChoices.map(c => (
        <MenuItem key={c.value} value={c.value}>
          {c.text}
        </MenuItem>
      ))}
    </TextField>
  )
}

export const MuiCheckboxQuestion = ({question: q}: QuestionProps<QuestionCheckboxModel>) => {
  const values = (q.value as string[]) || []

  if (!q?.isVisible) {
    return null
  }

  return (
    <Stack sx={{width: q.width || '100%', minWidth: q.minWidth}} direction="row" spacing={1}>
      {q.visibleChoices.map(c => (
        <FormControlLabel
          key={c.value}
          control={
            <Checkbox
              checked={values.includes(String(c.value))}
              onChange={e => {
                q.value = [e.target.checked]
              }}
            />
          }
          label={c.text}
        />
      ))}
    </Stack>
  )
}

export const MuiTagboxQuestion = ({question: q}: QuestionProps<QuestionTagboxModel>) => {
  const values = (q.value as string[]) || []

  if (!q?.isVisible) {
    return null
  }

  return (
    <Stack sx={{width: q.width || '100%', minWidth: q.minWidth, mt: 2}} direction="row" spacing={1}>
      {q.visibleChoices.map(c => (
        <Chip
          key={c.value}
          label={c.text}
          color={values.includes(c.value) ? 'primary' : 'default'}
          onClick={() => {
            q.value = values.includes(c.value) ? values.filter(v => v !== c.value) : [...values, c.value]
          }}
        />
      ))}
    </Stack>
  )
}

export const MuiImageQuestion = ({question: q}: QuestionProps<QuestionImageModel>) => {
  if (!q?.isVisible) {
    return null
  }

  return (
    <Card sx={{width: q.width || '100%', minWidth: q.minWidth, mt: 2}}>
      <CardMedia component="img" height={q.imageHeight} image={q.imageLink} />
    </Card>
  )
}

export const MuiHtmlQuestion = ({question: q}: QuestionProps<QuestionHtmlModel>) => {
  if (!q?.isVisible) {
    return null
  }

  return <Box sx={{width: q.width || '100%', minWidth: q.minWidth, mt: 2}} dangerouslySetInnerHTML={{__html: q.html ?? ''}} />
}

export const theme = createTheme({
  palette: {primary: {main: '#1976d2'}},
})
