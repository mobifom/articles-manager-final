const baseConfig = require('../../eslint.config.js');

const packageIgnores = {
  ignores: [
    'dist/',
    'coverage/',
    '**/*.spec.ts', // Ignore test files for linting if needed
    'src/generated/'
  ]
};

module.exports = [
  packageIgnores,
  ...baseConfig,
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      // Additional React-specific rules
      'react/jsx-key': 'error',
      'react/no-array-index-key': 'warn',
      'react/jsx-props-no-spreading': ['warn', {
        html: 'ignore',
        exceptions: ['input', 'textarea']
      }],
      'react/self-closing-comp': ['error', {
        component: true,
        html: true
      }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  {
    files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off'
    }
  }
];