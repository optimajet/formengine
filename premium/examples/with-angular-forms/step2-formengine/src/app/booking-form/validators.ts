import {RuleValidatorResult, Validators} from "@react-form-builder/core";

export const customValidators: Validators = {
  'string': {
    'isFullName': {
      validate: (value: string, _event, _args): RuleValidatorResult => {
        const valid = !!value && value.trim().split(' ').length > 1;

        return valid ? true : 'Please enter a full name'
      }
    },
    'emailAddressValid': {
      validate: (value: string, _event, _args) => {
        const pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/

        return pattern.test(value) ? true : 'Please enter a valid email address'
      }
    }
  }
}
