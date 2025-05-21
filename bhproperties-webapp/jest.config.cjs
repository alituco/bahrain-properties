/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      { configFile: './babel-jest.config.js' }, 
    ],
  },

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',

    '\\.(ico|png|jpe?g|gif|svg|webp|avif|css|scss|pdf)$':
      '<rootDir>/__mocks__/next/fileMock.js',
  },
};
