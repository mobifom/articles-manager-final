// Polyfills for streams and encoding
import { ReadableStream, TransformStream, WritableStream } from 'web-streams-polyfill/ponyfill';
import { TextEncoder, TextDecoder } from 'util';

// Assign polyfills globally
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

// Import MSW and handlers after polyfills
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create MSW server with handlers
export const server = setupServer(...handlers);