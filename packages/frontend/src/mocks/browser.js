// packages/frontend/src/mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Make sure Response, Request, Headers are defined in the browser context
if (typeof window !== 'undefined') {
  // These should already be defined in browser environments,
  // but we ensure they are available for consistency
  if (!window.Response) window.Response = Response;
  if (!window.Request) window.Request = Request;
  if (!window.Headers) window.Headers = Headers;
}

// Configure the MSW worker with the request handlers
export const worker = setupWorker(...handlers);