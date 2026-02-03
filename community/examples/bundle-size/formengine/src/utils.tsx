import type {CustomActions, FormValidators} from '@react-form-builder/core'

export const actions: CustomActions = {
  onSubmit: (e: {data: unknown}) => {
    console.warn('Form data', JSON.parse(JSON.stringify(e.data)))
  },
}

export const formValidators: FormValidators = [
  async (data: Record<string, unknown>) => {
    const result: Record<string, string> = {}
    const checkInValue = data['check-in-date'] as string | Date | undefined
    const checkOutValue = data['check-out-date'] as string | Date | undefined

    if (checkInValue && checkOutValue) {
      const checkIn = new Date(checkInValue)
      checkIn.setHours(0, 0, 0, 0)
      const checkOut = new Date(checkOutValue)
      checkOut.setHours(0, 0, 0, 0)

      if (checkOut < checkIn) {
        result['check-out-date'] = 'Invalid date range: check-out date cannot precede check-in date.'
      }
    }

    return Object.keys(result).length > 0 ? result : undefined
  },
]
