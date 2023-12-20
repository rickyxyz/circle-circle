module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:vitest/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['!.storybook'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    // Configuration for Storybook
    {
      files: ['stories/**/*.stories.*'],
      extends: ['plugin:storybook/recommended'],
    },
    // Configuration for e2e testing (Playwright)
    {
      files: ['tests/e2e/**/*'],
      extends: ['plugin:playwright/recommended'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-refresh',
    'vitest',
    'prettier',
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-confusing-void-expression': [
      'error',
      {
        ignoreArrowShorthand: true,
      },
    ],
  },
};
