// packages/backend/src/tests/setup.ts

// Set up global environment variables for tests
process.env['NODE_ENV'] = 'test';
process.env['PORT'] = '3333';
process.env['HOST'] = 'localhost';

// Import necessary libraries if needed
import axios from 'axios';

// Configure axios for tests
axios.defaults.baseURL = `http://${process.env['HOST']}:${process.env['PORT']}`;

// Add global mocks or polyfills if needed
// Using no-op functions instead of jest.fn()
const noop = () => {};

global.console = {
  ...console,
  // Customize console methods for tests if needed
  error: noop,
  warn: noop,
  log: noop,
};

// You can add more test setup code here as needed