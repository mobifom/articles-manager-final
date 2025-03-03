import type { Config } from '@jest/types';
import { readFileSync } from 'fs';
import { join } from 'path';

// Manually read the tsconfig.json
const tsConfigPath = join(__dirname, 'tsconfig.json');
const tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf8'));

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
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...Object.entries(tsConfig.compilerOptions?.paths || {}).reduce((acc, [key, value]) => {
      const mappedKey = key.replace('/*', '/(.*)');
      const mappedValue = Array.isArray(value)
        ? value.map(v => `<rootDir>/${v.replace('/*', '/$1')}`)
        : [`<rootDir>/${(value as string).replace('/*', '/$1')}`];
      
      acc[mappedKey] = mappedValue;
      return acc;
    }, {} as Record<string, string[]>)
  },
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: '../../coverage/packages/frontend',
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
};

export default config;