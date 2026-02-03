export const loginForm = JSON.stringify({
  errorType: 'MuiErrorWrapper',
  form: {
    key: 'Screen',
    type: 'Screen',
    children: [
      {
        key: 'email',
        type: 'MuiTextField',
        props: {label: {value: 'Email'}, placeholder: {value: 'Enter your email'}},
        schema: {validations: [{key: 'required'}, {key: 'email'}]},
        css: {any: {object: {display: 'flex', width: '100%'}}},
      },
      {
        key: 'password',
        type: 'MuiTextField',
        props: {label: {value: 'Password'}, placeholder: {value: 'Enter your password'}, type: {value: 'password'}},
        schema: {validations: [{key: 'required'}, {key: 'min', args: {limit: 6}}]},
        css: {any: {object: {display: 'flex', width: '100%'}}},
      },
      {
        key: 'rememberMe',
        type: 'MuiCheckbox',
        props: {label: {value: 'Remember me'}, checked: {value: true}},
      },
      {
        key: 'submit',
        type: 'MuiButton',
        props: {children: {value: 'Login'}, variant: {value: 'contained'}, color: {value: 'primary'}},
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
