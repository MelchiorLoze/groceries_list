module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      // Test files only
      files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    curly: ['error', 'multi-or-nest', 'consistent'],
  },
  plugins: ['@typescript-eslint', 'jest'],
};
