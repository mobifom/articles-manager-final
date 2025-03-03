// packages/frontend/src/test-setup.ts
import '@testing-library/jest-dom';
import { server } from './tests/mocks/server';

// Register web components to ensure they're available for tests
import './components/web-components';

// Setup MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

// Mock fetch if not available in test environment
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}

// Polyfill TextEncoder/TextDecoder if needed
if (typeof global.TextEncoder === 'undefined' || typeof global.TextDecoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}