// eslint.config.js
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

// Initialize FlatCompat
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  // Common ignores
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '.env',
      '.env.local',
      '.nx/**',
      '*.log',
      '.DS_Store',
      'packages/*/src/generated/**'
    ]
  },
  // Base JavaScript rules
  js.configs.recommended,
  // Use only the TypeScript and React configs from the compatibility layer
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:@nx/typescript',
    'plugin:@nx/react',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ),
  // Explicitly DISABLE all import plugin rules to avoid the compatibility issues
  {
    rules: {
      // Disable ALL import plugin rules
      'import/first': 'off',
      'import/no-duplicates': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/no-amd': 'off',
      'import/no-commonjs': 'off',
      'import/no-nodejs-modules': 'off',
      'import/exports-last': 'off',
      'import/extensions': 'off',
      'import/first': 'off',
      'import/group-exports': 'off',
      'import/max-dependencies': 'off',
      'import/named': 'off',
      'import/namespace': 'off',
      'import/newline-after-import': 'off',
      'import/no-absolute-path': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/no-cycle': 'off',
      'import/no-default-export': 'off',
      'import/no-deprecated': 'off',
      'import/no-dynamic-require': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-import-module-exports': 'off',
      'import/no-mutable-exports': 'off',
      'import/no-named-default': 'off',
      'import/no-namespace': 'off',
      'import/no-relative-packages': 'off',
      'import/no-relative-parent-imports': 'off',
      'import/no-restricted-paths': 'off',
      'import/no-self-import': 'off',
      'import/no-unassigned-import': 'off',
      'import/no-unused-modules': 'off',
      'import/no-useless-path-segments': 'off',
      'import/no-webpack-loader-syntax': 'off',
      'import/order': 'off',
      'import/prefer-default-export': 'off',
      'import/unambiguous': 'off'
    }
  },
  // TypeScript specific rules
  {
    files: ['*.ts', '*.tsx'],
    rules: {
      '@nx/enforce-module-boundaries': 'error'
    }
  },
  // Test files exceptions
  {
    files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];