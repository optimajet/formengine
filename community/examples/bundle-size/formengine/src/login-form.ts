export const loginForm = JSON.stringify({
  errorType: 'RsErrorMessage',
  form: {
    key: 'Screen',
    type: 'Screen',
    children: [
      {
        key: 'email',
        type: 'RsInput',
        props: {label: {value: 'Email'}, placeholder: {value: 'Enter your email'}},
        schema: {validations: [{key: 'required'}, {key: 'email'}]},
      },
      {
        key: 'password',
        type: 'RsInput',
        props: {label: {value: 'Password'}, placeholder: {value: 'Enter your password'}, passwordMask: {value: true}},
        schema: {validations: [{key: 'required'}, {key: 'min', args: {limit: 6}}]},
      },
      {
        key: 'rememberMe',
        type: 'RsCheckbox',
        props: {children: {value: 'Remember me'}, checked: {value: true}},
      },
      {
        key: 'submit',
        type: 'RsButton',
        props: {children: {value: 'Login'}, color: {value: 'blue'}, appearance: {value: 'primary'}},
        events: {
          onClick: [
            {type: 'common', name: 'validate', args: {failOnError: true}},
            {type: 'custom', name: 'onSubmit'},
          ],
        },
      },
    ],
  },
})
