export const todayIso = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(0, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

export const tomorrowIso = () => {
  const date = new Date()
  date.setDate(date.getDate() + 2)
  date.setHours(0, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

export const todayDate = () => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}
