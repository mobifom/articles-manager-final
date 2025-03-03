// packages/frontend/src/test-setup.ts
import '@testing-library/jest-dom';

// Import the streams polyfill first before any other imports
import { ReadableStream, TransformStream, WritableStream } from 'web-streams-polyfill/ponyfill';
import { TextEncoder, TextDecoder } from 'util';
import { Response, Request, Headers } from 'node-fetch';

// Assign all necessary globals
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
global.WritableStream = WritableStream;
global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Now import the MSW server
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

// Set up fetch polyfill for Node environment
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}