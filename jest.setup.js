// Polyfill for the Response object
global.Response = require('node-fetch').Response;
