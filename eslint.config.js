// @ts-ignore
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    formatters: true,
    astro: true,
    markdown: false,
    ignores: [
      '**/*-deno-*/**',
      '**/.astro/**',
      // ...globs
    ],
  },
  {
    rules: {
      'antfu/if-newline': 'off',
      'antfu/top-level-function': 'off',
      'node/prefer-global/buffer': 'off',
      'node/prefer-global/process': 'off',
      'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
      'style/brace-style': ['error', '1tbs'],
      'unused-imports/no-unused-vars': [
        'error',
        {
          'argsIgnorePattern': '^_',
          'varsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ]
    },
  },
  {
    files: ['**/repl.js'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['**/*.json'],
    rules: {
      'style/eol-last': 'off',
    },
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        expect: 'readonly',
        it: 'readonly',
      },
    },
  },
)
