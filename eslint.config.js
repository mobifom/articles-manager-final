const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');


// Initialize FlatCompat with the correct parameters
const compat = new FlatCompat({
  // Specify your eslint base directory, usually the project root
  baseDirectory: __dirname,
  // Optionally, provide settings for recommended configs
  recommendedConfig: js.configs.recommended
});

module.exports = [
    // Common ignore patterns for all projects
    {
      ignores: [
        // Build outputs
        'dist/',
        'build/',
        'coverage/',
        
        // Dependency directories
        'node_modules/',
        
        // Environment files
        '.env',
        '.env.local',
        
        // Nx workspace
        '.nx/',
        
        // Temporary and log files
        '*.log',
        '.DS_Store',
        
        // Generated files
        'packages/*/src/generated/'
      ]
    },
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
      'import': importPlugin
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.base.json'
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },
    rules: {
      // Disable problematic import rules
      'import/no-named-as-default': 'off',
      'import/no-amd': 'off',
      
      // Other import rules you want to keep
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
      'import/named': 'error'
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