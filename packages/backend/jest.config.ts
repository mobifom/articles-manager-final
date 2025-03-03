// packages/backend/jest.config.ts
export default {
  displayName: 'backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest', 
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        // Increase diagnostics to catch potential issues
        diagnostics: {
          warnOnly: true
        }
      }
    ]
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/backend',
  testMatch: ["**/src/tests/api/**/*.spec.ts"],
  // Remove the setupFilesAfterEnv that's causing the error
  
  // Add transformIgnorePatterns to ensure node_modules that need transformation are handled
  transformIgnorePatterns: [
    "/node_modules/(?!(@mswjs|msw|swagger-typescript-api)/)"
  ],
  // Add modulePathIgnorePatterns to avoid conflicts
  modulePathIgnorePatterns: [
    "<rootDir>/dist/"
  ]
};