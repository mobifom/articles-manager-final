const baseConfig = require('../../eslint.config.js');

module.exports = [
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
  }
];