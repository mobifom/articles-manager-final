const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      // Backend-specific rules
      '@typescript-eslint/no-var-requires': 'error',
      'no-unused-expressions': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          '**/*.test.ts', 
          '**/*.spec.ts', 
          '**/tests/**/*'
        ]
      }]
    }
  }
];

export default {
  displayName: 'backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/backend'
};