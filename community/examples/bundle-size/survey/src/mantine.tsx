import {Badge, Box, Card, Checkbox, Group, Image, MantineProvider, Select, TextInput, Textarea, createTheme} from '@mantine/core'
import type {ReactNode} from 'react'
import type {
  QuestionCheckboxModel,
  QuestionCommentModel,
  QuestionDropdownModel,
  QuestionHtmlModel,
  QuestionImageModel,
  QuestionTagboxModel,
  QuestionTextModel,
} from 'survey-core'

type QuestionProps<T> = {question: T}

export const MantineTextQuestion = ({question: q}: QuestionProps<QuestionTextModel>) => {
  if (!q.isVisible) {
    return null
  }

  return (
    <TextInput
      w={q.width || '100%'}
      miw={q.minWidth}
      mt="sm"
      type={q.inputType || 'text'}
      label={q.titleLocation === 'hidden' ? undefined : String(q.title)}
      placeholder={q.placeholder}
      value={(q.value as string) ?? ''}
      error={q.hasErrors() ? q.errors?.[0]?.text : null}
      onChange={event => {
        // eslint-disable-next-line react-hooks/immutability
        q.value = event.currentTarget.value
      }}
    />
  )
}

export const MantineCommentQuestion = ({question: q}: QuestionProps<QuestionCommentModel>) => {
  if (!q.isVisible) {
    return null
  }

  return (
    <Textarea
      w={q.width || '100%'}
      miw={q.minWidth}
      mt="sm"
      minRows={3}
      placeholder={q.placeholder}
      value={(q.value as string) ?? ''}
      onChange={event => {
        // eslint-disable-next-line react-hooks/immutability
        q.value = event.currentTarget.value
      }}
    />
  )
}

export const MantineDropdownQuestion = ({question: q}: QuestionProps<QuestionDropdownModel>) => {
  if (!q.isVisible) {
    return null
  }

  return (
    <Select
      w={q.width || '100%'}
      miw={q.minWidth}
      mt="sm"
      value={q.value ? String(q.value) : null}
      placeholder={q.placeholder}
      data={q.visibleChoices.map(choice => ({
        value: String(choice.value),
        label: String(choice.text),
      }))}
      onChange={value => {
        // eslint-disable-next-line react-hooks/immutability
        q.value = value ?? undefined
      }}
    />
  )
}

export const MantineCheckboxQuestion = ({question: q}: QuestionProps<QuestionCheckboxModel>) => {
  const values = Array.isArray(q.value) ? (q.value as string[]) : []

  if (!q.isVisible) {
    return null
  }

  return (
    <Group w={q.width || '100%'} miw={q.minWidth} mt="sm" gap="sm">
      {q.visibleChoices.map(choice => {
        const choiceValue = String(choice.value)
        return (
          <Checkbox
            key={choiceValue}
            checked={values.includes(choiceValue)}
            label={String(choice.text)}
            onChange={event => {
              const shouldAdd = event.currentTarget.checked
              q.value = shouldAdd ? [...values, choiceValue] : values.filter(value => value !== choiceValue)
            }}
          />
        )
      })}
    </Group>
  )
}

export const MantineTagboxQuestion = ({question: q}: QuestionProps<QuestionTagboxModel>) => {
  const values = Array.isArray(q.value) ? (q.value as string[]) : []

  if (!q.isVisible) {
    return null
  }

  return (
    <Group w={q.width || '100%'} miw={q.minWidth} mt="sm" gap="xs">
      {q.visibleChoices.map(choice => {
        const choiceValue = String(choice.value)
        const selected = values.includes(choiceValue)
        return (
          <Badge
            key={choiceValue}
            variant={selected ? 'filled' : 'light'}
            style={{cursor: 'pointer'}}
            onClick={() => {
              q.value = selected ? values.filter(value => value !== choiceValue) : [...values, choiceValue]
            }}
          >
            {String(choice.text)}
          </Badge>
        )
      })}
    </Group>
  )
}

export const MantineImageQuestion = ({question: q}: QuestionProps<QuestionImageModel>) => {
  if (!q.isVisible) {
    return null
  }

  return (
    <Card w={q.width || '100%'} miw={q.minWidth} mt="sm" p={0}>
      <Image h={q.imageHeight} src={q.imageLink ?? ''} />
    </Card>
  )
}

export const MantineHtmlQuestion = ({question: q}: QuestionProps<QuestionHtmlModel>) => {
  if (!q.isVisible) {
    return null
  }

  return <Box w={q.width || '100%'} miw={q.minWidth} mt="sm" dangerouslySetInnerHTML={{__html: q.html ?? ''}} />
}

export const theme = createTheme({
  primaryColor: 'blue',
})

export const MantineThemeProvider = ({children}: {children: ReactNode}) => {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
