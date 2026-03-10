export const loginFormMantine = JSON.stringify({
  errorType: 'MtErrorWrapper',
  form: {
    key: 'Screen',
    type: 'Screen',
    children: [
      {
        key: 'email',
        type: 'MtTextInput',
        props: {label: {value: 'Email'}, placeholder: {value: 'Enter your email'}, type: {value: 'email'}},
        schema: {validations: [{key: 'required'}, {key: 'email'}]},
      },
      {
        key: 'password',
        type: 'MtPasswordInput',
        props: {label: {value: 'Password'}, placeholder: {value: 'Enter your password'}},
        schema: {validations: [{key: 'required'}, {key: 'min', args: {limit: 6}}]},
      },
      {
        key: 'rememberMe',
        type: 'MtCheckbox',
        props: {label: {value: 'Remember me'}, checked: {value: true}},
      },
      {
        key: 'submit',
        type: 'MtButton',
        props: {children: {value: 'Login'}, variant: {value: 'filled'}, color: {value: 'blue'}},
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
