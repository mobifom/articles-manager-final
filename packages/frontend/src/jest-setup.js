// packages/frontend/src/jest-setup.js
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// For MSW which uses web streams
const { ReadableStream, WritableStream, TransformStream } = require('web-streams-polyfill');
global.ReadableStream = ReadableStream;
global.WritableStream = WritableStream;
global.TransformStream = TransformStream;

// Other necessary globals for browser-like environment
if (typeof window !== 'undefined') {
  // These should already be defined in browser environments
  if (!window.TextEncoder) window.TextEncoder = TextEncoder;
  if (!window.TextDecoder) window.TextDecoder = TextDecoder;
  if (!window.ReadableStream) window.ReadableStream = ReadableStream;
  if (!window.WritableStream) window.WritableStream = WritableStream;
  if (!window.TransformStream) window.TransformStream = TransformStream;
}