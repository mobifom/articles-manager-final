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