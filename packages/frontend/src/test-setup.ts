// packages/frontend/src/test-setup.ts
// Essential testing libraries and polyfills
import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Streams and encoding polyfillsÏ
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';

// Handle polyfills more carefully to avoid type conflicts
if (typeof global.TextEncoder === 'undefined') {
  // @ts-ignore - TypeScript doesn't recognize the compatibility between Node's TextEncoder and the DOM one
  global.TextEncoder = NodeTextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  // @ts-ignore - TypeScript doesn't recognize the compatibility between Node's TextDecoder and the DOM one
  global.TextDecoder = NodeTextDecoder;
}

// Only add stream polyfills if they don't exist
if (typeof global.ReadableStream === 'undefined') {
  const { ReadableStream } = require('web-streams-polyfill/ponyfill');
  global.ReadableStream = ReadableStream;
}
if (typeof global.WritableStream === 'undefined') {
  const { WritableStream } = require('web-streams-polyfill/ponyfill');
  // @ts-ignore - Type conflicts between different WritableStream implementations
  global.WritableStream = WritableStream;
}
if (typeof global.TransformStream === 'undefined') {
  const { TransformStream } = require('web-streams-polyfill/ponyfill');
  global.TransformStream = TransformStream;
}

// MSW setup - import after polyfills
import { server } from './tests/mocks/server';

// BroadcastChannel Polyfill
// Enhanced BroadcastChannel Polyfill with proper interface implementation
class BroadcastChannelPolyfill {
  name: string;
  private listeners: Array<(event: MessageEvent) => void> = [];
  private errorListeners: Array<(event: MessageEvent) => void> = [];
  
  // Required properties to match BroadcastChannel interface
  onmessage: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
  onmessageerror: ((this: BroadcastChannel, ev: MessageEvent) => any) | null = null;
  
  constructor(name: string) {
    this.name = name;
  }

  postMessage(message: any): void {
    const event = { data: message } as MessageEvent;
    
    // Call onmessage if it exists
    if (this.onmessage) {
      this.onmessage.call(this, event);
    }
    
    // Call all registered message listeners
    this.listeners.forEach(listener => listener(event));
  }

  addEventListener(type: string, callback: (event: MessageEvent) => void): void {
    if (type === 'message') {
      this.listeners.push(callback);
    } else if (type === 'messageerror') {
      this.errorListeners.push(callback);
    }
  }

  removeEventListener(type: string, callback: (event: MessageEvent) => void): void {
    if (type === 'message') {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    } else if (type === 'messageerror') {
      this.errorListeners = this.errorListeners.filter(listener => listener !== callback);
    }
  }

  close(): void {
    this.listeners = [];
    this.errorListeners = [];
  }
  
  // Implementation of EventTarget.dispatchEvent required by BroadcastChannel interface
  dispatchEvent(event: Event): boolean {
    if (event.type === 'message' && this.onmessage) {
      this.onmessage.call(this, event as MessageEvent);
      return !event.defaultPrevented;
    }
    if (event.type === 'messageerror' && this.onmessageerror) {
      this.onmessageerror.call(this, event as MessageEvent);
      return !event.defaultPrevented;
    }
    return true;
  }
}

// Only polyfill if it doesn't exist
if (typeof global.BroadcastChannel === 'undefined') {
  // @ts-ignore - TypeScript doesn't recognize our polyfill matches the interface
  global.BroadcastChannel = BroadcastChannelPolyfill;
}

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