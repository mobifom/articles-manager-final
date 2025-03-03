// packages/frontend/src/tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Create the server instance
export const server = setupServer(...handlers);