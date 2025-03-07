// packages/frontend/jest.polyfills.js
// Polyfills for Jest environment
const { TextEncoder, TextDecoder } = require('util');

// Import web streams polyfill
const { 
  ReadableStream, 
  WritableStream,
  TransformStream 
} = require('web-streams-polyfill/ponyfill');

// Import node-fetch for Response, Request, Headers globals
const nodeFetch = require('node-fetch');

// Assign all required globals
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
global.Response = nodeFetch.Response;
global.Request = nodeFetch.Request;
global.Headers = nodeFetch.Headers;
global.fetch = nodeFetch;

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

// Web crypto API polyfill
if (!global.crypto) {
  global.crypto = {
    getRandomValues: (buffer) => {
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
      return buffer;
    }
  };
}

// Ensure global URL and URLSearchParams are available
if (typeof global.URL === 'undefined') {
  global.URL = require('url').URL;
}

if (typeof global.URLSearchParams === 'undefined') {
  global.URLSearchParams = require('url').URLSearchParams;
}

// Polyfill for Event constructor
if (typeof global.Event === 'undefined') {
  global.Event = class Event {
    constructor(type, options = {}) {
      this.type = type;
      this.bubbles = !!options.bubbles;
      this.cancelable = !!options.cancelable;
    }
  };
}

// Mock localStorage and sessionStorage
if (!global.localStorage) {
  global.localStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}

if (!global.sessionStorage) {
  global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
}