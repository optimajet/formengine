/* eslint-env node */
module.exports = {
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:jsdoc/recommended-typescript-error',
    'plugin:react/recommended',
    'plugin:react-perf/all'
  ],
  plugins: ['@typescript-eslint', 'import', 'unused-imports', 'react-hooks', 'no-secrets', 'unicorn'],
  rules: {
    'no-restricted-syntax': ['error', {
      "selector": "CallExpression[callee.name='customizableObserver'] > ArrowFunctionExpression.arguments",
      "message": "never pass anonymous react components"
    }, {
      "selector": "CallExpression[callee.name='customizable'] > ArrowFunctionExpression.arguments",
      "message": "never pass anonymous react components"
    }, {
      "selector": "CallExpression[callee.name='namedObserver'] > ArrowFunctionExpression.arguments",
      "message": "never pass anonymous react components"
    }],
    'no-secrets/no-secrets': 'error',
    'no-console': ['error', {allow: ['warn', 'error']}],
    'no-warning-comments': ['error', {
      'terms': ['todo', 'fixme', 'wtf'],
      'location': 'anywhere'
    }],
    'one-var': ['error', 'never'],
    'react-hooks/exhaustive-deps': ['error', {
      'additionalHooks': ''
    }],
    'unicorn/no-useless-fallback-in-spread': 'error',
    'unicorn/no-useless-spread': 'error',
    'unicorn/prefer-spread': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': ['error', {'ts-ignore': 'allow-with-description'}],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-implied-eval': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': false,
      'optionalDependencies': false,
      'bundledDependencies': false,
    }],
    'import/no-deprecated': 'error',
    'import/no-mutable-exports': 'error',
    'import/no-absolute-path': 'error',
    'import/no-nodejs-modules': 'error',
    'import/no-relative-packages': 'error',
    'import/no-useless-path-segments': 'error',
    'import/consistent-type-specifier-style': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@*/**/src/**'],
            message: 'Do not import from package internal src paths; use the package public API.',
          },
        ],
      },
    ],
    '@typescript-eslint/no-import-type-side-effects': 'error',
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    'init-declarations': 'off',
    '@typescript-eslint/init-declarations': ['error', 'always'],
    'import/extensions': ['error', {
      ignorePackages: true,
      pattern: {
        'ts': 'never',
        'tsx': 'never',
        'd.ts': 'never',
        'js': 'always',
        'jsx': 'always',
        'json': 'always',
        'css': 'always',
      },
    }],
    'unused-imports/no-unused-imports': 'error',
    'jsdoc/require-jsdoc': ['error',
      {
        'publicOnly': true, 'require': {
          'ArrowFunctionExpression': true,
          'ClassDeclaration': true,
          'ClassExpression': true,
          'FunctionDeclaration': true,
          'FunctionExpression': true,
          'MethodDefinition': true,
        },
        'contexts': ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration', 'TSEnumDeclaration', 'TSPropertySignature'],
      },
    ],
    'jsdoc/no-multi-asterisks': ['error', {
      'allowWhitespace': true
    }],
    // Keep `typed: true` from `plugin:jsdoc/recommended-typescript-error`; add tool-specific tags.
    'jsdoc/check-tag-names': ['error', {
      typed: true,
      definedTags: ['knipignore'],
    }],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  root: true,
  overrides: [
    {
      files: ['**/config/*.ts'],
      rules: {
        'import/no-nodejs-modules': 'off',
        'no-console': 'off',
        'jsdoc/require-jsdoc': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/require-await': 'off',
        'no-inner-declarations': 'off',
      },
    },
    {
      files: [
        'scripts/*.ts',
        'scripts/**/*.ts',
        'documentation/website/scripts/*.ts',
        'documentation/website/scripts/**/*.ts',
      ],
      rules: {
        '@typescript-eslint/require-await': 'off',
        'no-console': 'off',
        'import/no-nodejs-modules': 'off'
      },
    },
  ],
};
