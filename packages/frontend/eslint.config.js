// packages/frontend/eslint.config.js
const baseConfig = require('../../eslint.config.js');

// Frontend-specific ignores
const frontendIgnores = {
  ignores: [
    'dist/**',
    'coverage/**',
    'src/generated/**'
  ]
};

module.exports = [
  // Add frontend-specific ignores
  frontendIgnores,
  // Use the base config
  ...baseConfig,
  // Add frontend-specific rules
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      // React-specific rules
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/self-closing-comp': ['error', {
        component: true,
        html: true
      }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  // Special rules for test files
  {
    files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off'
    }
  }
];