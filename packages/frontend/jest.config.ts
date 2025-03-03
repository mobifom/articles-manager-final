// packages/frontend/jest.config.ts
import type { Config } from '@jest/types';
import { readFileSync } from 'fs';
import { join } from 'path';

// Manually read the tsconfig.json
const tsConfigPath = join(__dirname, 'tsconfig.json');
const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf8'));

const config: Config.InitialOptions = {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: {
        warnOnly: true
      }
    }]
  },
  setupFiles: ['<rootDir>/jest.polyfills.js'],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...Object.entries(tsConfig.paths || {}).reduce((acc, [key, value]) => {
      const mappedKey = key.replace('/*', '/(.*)');
      const mappedValue = Array.isArray(value)
        ? value.map(v => `<rootDir>/${v.replace('/*', '/$1')}`)
        : [`<rootDir>/${(value as string).replace('/*', '/$1')}`];
      
      acc[mappedKey] = mappedValue as string[];
      return acc;
    }, {} as Record<string, string[]>)
  },
  coverageDirectory: '../../coverage/packages/frontend',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/tests/**/*'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  reporters: [
    'default',
    ['jest-junit', { 
      outputDirectory: 'reports/junit',
      outputName: 'junit.xml'
    }]
  ],
  testTimeout: 10000,
  verbose: true
};

export default config;