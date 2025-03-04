// packages/frontend/eslint.config.js
const baseConfig = require('../../eslint.config.js');

// Create a separate ignores config
const packageIgnores = {
  ignores: [
    'dist/**',
    'coverage/**',
    '**/*.spec.ts',
    '**/*.spec.tsx',
    '**/*.test.ts',
    '**/*.test.tsx',
    'src/generated/**'
  ]
};

module.exports = [
  // Add ignores first
  packageIgnores,
  // Then spread the base config
  ...baseConfig,
  // Add React-specific rules
  {
    files: ['**/*.tsx', '**/*.jsx'],
    rules: {
      // Disable problematic import rules
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      
      // Keep other React-specific rules
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
  // Specific rules for test files
  {
    files: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react/display-name': 'off'
    }
  }
];