// packages/frontend/src/tests/mocks/server.ts
import { TextEncoder, TextDecoder } from 'util';

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

// BroadcastChannel Polyfill
class BroadcastChannelPolyfill {
  name: string;
  listeners: Function[];

  constructor(name: string) {
    this.name = name;
    this.listeners = [];
  }

  postMessage(message: any) {
    this.listeners.forEach(listener => listener({ data: message }));
  }

  addEventListener(event: string, callback: Function) {
    if (event === 'message') {
      this.listeners.push(callback);
    }
  }

  removeEventListener(event: string, callback: Function) {
    if (event === 'message') {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    }
  }

  close() {
    this.listeners = [];
  }
}

// @ts-ignore - assign to global
global.BroadcastChannel = BroadcastChannelPolyfill;

// Now, import MSW after all polyfills are assigned
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create MSW server with handlers
export const server = setupServer(...handlers);