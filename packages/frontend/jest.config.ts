// packages/frontend/jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: {
        warnOnly: true
      }
    }]
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  // Set up files
  setupFiles: ['<rootDir>/src/jest-setup.js'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '../../coverage/packages/frontend',
  coverageReporters: ['text', 'lcov', 'html', 'json', 'clover'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  // Reporters configuration
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '../../reports/junit',
      outputName: 'frontend.xml'
    }]
  ],
  // Timeout configuration
  testTimeout: 10000,
  // Path patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/src/tests/ui/' // Ignore WebdriverIO UI tests
  ]
};

export default config;
