// packages/frontend/jest.config.ts
import { resolve } from 'path';

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
    '^msw$': resolve(__dirname, 'node_modules/msw/lib/index.mjs'),
    '^msw/(.*)$': resolve(__dirname, 'node_modules/msw/lib/$1.mjs')
  },
  setupFiles: [
    '<rootDir>/jest.polyfills.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts'
  ],
  testEnvironmentOptions: {
    customExportConditions: ['browser', 'node', 'default'],
    url: 'http://localhost/'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@testing-library|msw)/)'
  ],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true
      },
      useESM: true
    }
  },
  resolver: '<rootDir>/jest-msw-resolver.js'
};