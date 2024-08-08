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
    'arrow-body-style': ['warn', 'as-needed'],
    curly: ['error', 'multi-or-nest', 'consistent'],
    'no-console': 'warn',
    'no-debugger': 'warn',
  },
  plugins: ['@typescript-eslint', 'jest'],
};
