// Essential testing libraries and polyfills
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Streams and encoding polyfills
import { ReadableStream, TransformStream, WritableStream } from 'web-streams-polyfill/ponyfill';
import { TextEncoder, TextDecoder } from 'util';

// MSW setup
import { server } from './tests/mocks/server';

// Global polyfills and mocks
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
global.WritableStream = WritableStream;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// BroadcastChannel Polyfill
class BroadcastChannelPolyfill {
  constructor(name) {
    this.name = name;
    this.listeners = [];
  }

  postMessage(message) {
    this.listeners.forEach(listener => listener({ data: message }));
  }

  addEventListener(event, callback) {
    if (event === 'message') {
      this.listeners.push(callback);
    }
  }

  removeEventListener(event, callback) {
    if (event === 'message') {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    }
  }

  close() {
    this.listeners = [];
  }
}

global.BroadcastChannel = BroadcastChannelPolyfill;

// Mock fetch and other globals
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn();
}

// Silence specific console errors
const originalConsoleError = console.error;
console.error = (msg, ...args) => {
  if (
    !msg?.includes('Warning: An update inside a test was not wrapped in act') &&
    !msg?.includes('inside a test was not wrapped in act')
  ) {
    originalConsoleError(msg, ...args);
  }
};

// Setup MSW server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});