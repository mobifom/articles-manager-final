// eslint.config.js
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

// Initialize FlatCompat with the correct parameters
const compat = new FlatCompat({
  // Specify your eslint base directory, usually the project root
  baseDirectory: __dirname,
  // Optionally, provide settings for recommended configs
  recommendedConfig: js.configs.recommended
});

module.exports = [
  js.configs.recommended,
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:@nx/typescript',
    'plugin:@nx/react',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ),
  {
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      '@nx': require('@nx/eslint-plugin'),
      'import': require('eslint-plugin-import'),
      'react': require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks')
    },
    settings: {
      react: {
        version: 'detect'
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.base.json'
        }
      }
    },
    rules: {
      // Nx Workspace Rules
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*']
            }
          ]
        }
      ],

      // General Best Practices
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn', 
        { 
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'max-len': [
        'warn', 
        { 
          code: 120, 
          tabWidth: 2,
          ignoreComments: true,
          ignoreUrls: true,
          ignoreStrings: true
        }
      ],

      // Import Rules
      'import/order': [
        'warn',
        {
          groups: [
            'builtin', 
            'external', 
            'internal', 
            ['parent', 'sibling', 'index']
          ],
          'newlines-between': 'always'
        }
      ],
      'import/no-unresolved': 'error',
      'import/named': 'error',

      // React Specific Rules
      'react/prop-types': 'off', // TypeScript handles prop types
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/self-closing-comp': [
        'warn', 
        { 
          component: true, 
          html: true 
        }
      ],

      // TypeScript Specific
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'error', 
        { 'ts-ignore': 'allow-with-description' }
      ],

      // Best Practices
      'eqeqeq': ['error', 'smart'],
      'no-nested-ternary': 'error',
      'no-duplicate-imports': 'error'
    }
  },
  {
    files: ['*.ts', '*.tsx'],
    rules: {
      '@nx/enforce-module-boundaries': 'error'
    }
  },
  {
    files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];