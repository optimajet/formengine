import {RuleValidatorResult, Validators} from '@react-form-builder/core'

export const customValidators: Validators = {
  'string': {
    'isFullName': {
      validate: (value: string, _event, _args): RuleValidatorResult => {
        const valid = !!value && value.trim().split(' ').length > 1

        return valid ? true : 'Please enter a full name'
      }
    },
    'emailAddressValid': {
      validate: (value: string, _event, _args) => {
        const pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

        return pattern.test(value)
      }
    }
  },
  'number': {
    'checkGuestCount': {
      validate: (value: string, _event, _args) => {
        const num = parseInt(value)

        if (isFinite(num) && num > 0 && num < 7) return true

        return 'Guest count must be from 1 to 6'
      }
    }
  },
  'date': {
    'dateInTheFuture': {
      validate: (value: Date) => {
        const today = new Date()
        const date = new Date(value)

        today.setHours(0, 0, 0, 0)
        date.setHours(0, 0, 0, 0)

        if (+date >= +today) return true

        return 'Please select valid date'
      }
    }
  },

}
