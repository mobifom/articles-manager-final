// packages/frontend/src/test-setup.ts
import '@testing-library/jest-dom';
import { server } from './tests/mocks/server';
import { resetMockArticles } from './tests/mocks/handlers';

// Register web components to ensure they're available for tests
import './components/web-components';

// Setup MSW server before all tests
beforeAll(() => {
  // Start the MSW server before all tests
  server.listen({ onUnhandledRequest: 'warn' });
  
  // Mock window.confirm for tests
  window.confirm = jest.fn(() => true);

  // Silence console errors during tests
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Reset handlers and mock data after each test
afterEach(() => {
  // Reset any request handlers added during specific tests
  server.resetHandlers();
  
  // Reset mock articles data between tests
  resetMockArticles();
  
  // Clear all mocks
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  // Stop the MSW server after all tests
  server.close();
  
  // Restore console.error
  jest.restoreAllMocks();
});

// Mock React Router's useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

// Polyfill TextEncoder/TextDecoder if needed
if (typeof global.TextEncoder === 'undefined' || typeof global.TextDecoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Set up fetch polyfill for Node environment
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}