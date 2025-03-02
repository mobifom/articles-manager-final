const path = require('path');

module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.jest.json'
    }]
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^msw$': path.resolve(__dirname, 'node_modules/msw/lib/index.mjs'),
    '^msw/(.*)$': path.resolve(__dirname, 'node_modules/msw/lib/$1.mjs')
  },
  setupFiles: [
    '<rootDir>/jest.polyfills.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts'
  ],
  testEnvironmentOptions: {
    httpSignals: true,
    fetchExternalResources: true,
    resources: 'usable'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|msw)/)'
  ],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true
      }
    }
  },
  resolver: '<rootDir>/jest-msw-resolver.js'
};