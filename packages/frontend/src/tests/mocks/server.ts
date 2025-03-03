import { ReadableStream, TransformStream, WritableStream } from 'web-streams-polyfill/ponyfill';
import { TextEncoder, TextDecoder } from 'util';

// Assign the stream polyfills to global
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
global.WritableStream = WritableStream;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Now it's safe to import MSW
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Add the missing Response, Request, and Headers globals that MSW v2 needs
if (typeof global.Response === 'undefined') {
  const { Response, Request, Headers } = require('node-fetch');
  global.Response = Response;
  global.Request = Request;
  global.Headers = Headers;
}

// This configures a request mocking server with the given request handlers
export const server = setupServer(...handlers);