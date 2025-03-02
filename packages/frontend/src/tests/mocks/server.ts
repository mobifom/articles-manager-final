import { http, HttpResponse } from 'msw';
import { setupWorker } from 'msw';

// Ensure global fetch and Response are available
if (typeof globalThis.fetch === 'undefined') {
  const { fetch, Response } = require('node-fetch');
  globalThis.fetch = fetch;
  globalThis.Response = Response;
}

export const handlers = [
  http.get('/api/status', () => {
    return HttpResponse.json({
      status: 'ok',
      environment: process.env['NODE_ENV'] || 'development',
      timestamp: new Date().toISOString()
    });
  })
];

export const server = setupWorker(...handlers);