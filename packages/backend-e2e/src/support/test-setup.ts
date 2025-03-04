// packages/backend-e2e/src/support/test-setup.ts
 

import axios from 'axios';

module.exports = async function () {
  // Configure axios for tests to use.
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ?? '3333'; // Changed from 3000 to 3333 to match .env configuration
  axios.defaults.baseURL = `http://${host}:${port}`;
};