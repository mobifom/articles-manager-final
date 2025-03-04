// packages/backend/src/tests/setup/server-setup.ts
import { Express } from 'express';
import http from 'http';
import app from '../../main';

let server: http.Server;

// Start server before tests
export async function setupServer(): Promise<void> {
  return new Promise((resolve) => {
    // Use TEST_PORT and TEST_HOST from environment
    const port = process.env.TEST_PORT ? parseInt(process.env.TEST_PORT, 10) : 3333;
    const host = process.env.TEST_HOST || 'localhost';
    
    // Start the server
    server = app.listen(port, host, () => {
      console.log(`Test server running at http://${host}:${port}`);
      resolve();
    });
  });
}

// Stop server after tests
export async function teardownServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (server) {
      server.close((err) => {
        if (err) {
          console.error('Error closing test server:', err);
          reject(err);
        } else {
          console.log('Test server closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}