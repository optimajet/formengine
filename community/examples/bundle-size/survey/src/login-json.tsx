export const json = {
  title: 'Login',
  pages: [
    {
      name: 'auth',
      elements: [
        {
          name: 'email',
          title: 'Email',
          type: 'text',
          inputType: 'email',
          isRequired: true,
        },
        {
          name: 'password',
          title: 'Password',
          type: 'text',
          inputType: 'password',
          isRequired: true,
          minLength: 6,
        },
        {
          name: 'rememberMe',
          title: 'Remember me',
          type: 'boolean',
          defaultValue: true,
        },
      ],
    },
  ],
}
