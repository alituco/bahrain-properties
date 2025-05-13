module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
};
