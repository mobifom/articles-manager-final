const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      isolatedModules: true
    }]
  },
  resolver: '@nx/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html'],
  collectCoverage: true,
  coverageReporters: ['html', 'text', 'lcov', 'clover', 'json'],
  // Add transformIgnorePatterns to ensure node_modules that need transformation are handled
  transformIgnorePatterns: [
    "/node_modules/(?!(@mswjs|msw|swagger-typescript-api)/)"
  ]
};