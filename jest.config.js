module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: ['/node_modules/(?!react-native)/.+'],
  setupFiles: ['./node_modules/react-native-gesture-handler/jestSetup.js'],
  setupFilesAfterEnv: ['./jest.setup.ts', './jest.mock.ts'],
};
