const path = require('path');

module.exports = (path, options) => {
  // Default resolver logic
  const defaultResolver = require('jest-resolve').defaults;

  // Handle MSW imports specifically
  if (path.startsWith('msw')) {
    try {
      const mswPath = path.replace('msw', 
        options.rootDir + '/node_modules/msw/lib/index.mjs'
      );
      return mswPath;
    } catch (error) {
      // Fallback to default resolution
      return defaultResolver(path, options);
    }
  }

  // Fallback to default resolver
  return defaultResolver(path, options);
};