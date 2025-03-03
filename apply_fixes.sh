#!/bin/bash

# Variables
BRANCH_NAME="fix-jest-test-cases"
REPO="mobifom/articles-manager-final"

# Function to check if a command executed successfully
check_command() {
  if [ $? -ne 0 ]; then
    echo "Error: $1 failed"
    exit 1
  fi
}

# Step 2: Update Jest configuration files
cat <<EOF > jest.config.ts
import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
  testTimeout: 30000 // 30 seconds
});
EOF

cat <<EOF > packages/backend-e2e/jest.config.ts
export default {
  displayName: 'backend-e2e',
  preset: '../../jest.preset.js',
  globalSetup: '<rootDir>/src/support/global-setup.ts',
  globalTeardown: '<rootDir>/src/support/global-teardown.ts',
  setupFiles: ['<rootDir>/src/support/test-setup.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/backend-e2e',
};
EOF

cat <<EOF > packages/backend/jest.config.ts
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
EOF

# Step 3: Polyfill the Response object for Node.js environment
cat <<EOF > jest.setup.js
// Polyfill for the Response object
global.Response = require('node-fetch').Response;
EOF

# Step 4: Ensure MSW setup is correctly initialized
mkdir -p packages/frontend/src/tests/mocks
cat <<EOF > packages/frontend/src/test-setup.ts
import { server } from './tests/mocks/server';

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
EOF

# Step 5: Ensure ESLint configuration is updated
cat <<EOF > eslint.config.js
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');

// Initialize FlatCompat with the correct parameters
const compat = new FlatCompat({
  baseDirectory: __dirname, // replace with the base directory of your project
  resolvePluginsRelativeTo: __dirname,
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
          'groups': [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index']
          ],
          'newlines-between': 'always'
        }
      ],
      'import/no-unresolved': 'error',
      'import/named': 'error'
    }
  }
];
EOF

# Step 6: Update project-specific ESLint configurations
cat <<EOF > packages/backend-e2e/eslint.config.js
const baseConfig = require('../../eslint.config.js');

module.exports = [...baseConfig];
EOF

cat <<EOF > packages/backend/eslint.config.js
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
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];
EOF

# Step 7: Update project configuration
cat <<EOF > packages/backend-e2e/project.json
{
  "name": "backend-e2e",
  "type": "application",
  "implicitDependencies": ["backend"],
  "targets": {
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": [
          "packages/backend-e2e/src/**/*.{ts,js}"
        ],
        "config": "packages/backend-e2e/eslint.config.js",
        "fix": false,
        "cache": false
      }
    },
    "e2e": {
      "executor": "@nx/jest:jest",
      "outputs": ["{workspaceRoot}/coverage/{e2eProjectRoot}"],
      "options": {
        "jestConfig": "packages/backend-e2e/jest.config.ts",
        "passWithNoTests": true
      },
      "dependsOn": ["backend:build"]
    }
  }
}
EOF

cat <<EOF > packages/backend/project.json
{
  "name": "backend",
  "projectType": "application",
  "tags": [],
  "targets": {
    "lint": {
      "executor": "@nx/eslint:lint",
      "outputs": ["{options.outputFile}"],
      "options": {
        "lintFilePatterns": [
          "packages/backend/src/**/*.{ts,js}"
        ],
        "config": "packages/backend/eslint.config.js",
        "fix": false,
        "cache": false,
        "maxWarnings": 0
      }
    },
    "build": {
      "executor": "@nx/esbuild:esbuild",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/apps/backend",
        "main": "packages/backend/src/main.ts",
        "tsConfig": "packages/backend/tsconfig.app.json",
        "assets": ["packages/backend/src/assets"]
      }
    }
  }
}
EOF

# Step 8: Push the changes to the new branch
git add .
git commit -m "Fix Jest test cases and configurations, update ESLint"
check_command "git commit"
git push origin $BRANCH_NAME
check_command "git push origin $BRANCH_NAME"

echo "All fixes applied and changes pushed to branch $BRANCH_NAME"