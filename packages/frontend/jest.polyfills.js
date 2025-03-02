// Polyfills for Jest environment
const { TextEncoder, TextDecoder } = require('web-encoding');
require('whatwg-fetch');

// Provide TextEncoder and TextDecoder globally
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill BroadcastChannel
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

// Ensure global fetch and Response are available
if (typeof globalThis.fetch === 'undefined') {
  const { fetch, Response } = require('node-fetch');
  globalThis.fetch = fetch;
  globalThis.Response = Response;
}