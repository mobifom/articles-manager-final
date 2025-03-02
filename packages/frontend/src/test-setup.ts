import '@testing-library/jest-dom';
import { server } from './tests/mocks/server';

// Establish API mocking before all tests
beforeAll(() => server.start());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.stop());