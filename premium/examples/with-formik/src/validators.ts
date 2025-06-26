import * as Yup from 'yup'

export const fullName = Yup.string().required().test({
  message: 'Please enter a full name',
  test: (value: string) => !!value && value.trim().split(' ').length > 1
})

export const dateTodayOrInTheFuture = Yup.date().required().test({
  message: 'Dates in the past are impossible to book',
  test: (value: Date) => {
    const today = new Date()
    const date = new Date(value)

    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)

    return +date >= +today
  }
})

export const checkGuestsCount = Yup.number().required().min(1).max(6)
