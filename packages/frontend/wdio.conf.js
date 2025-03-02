exports.config = {
    runner: 'local',
    specs: [
      './src/tests/ui/**/*.test.ts'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
      maxInstances: 1,
      browserName: 'chrome',
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu', '--window-size=1280,800']
      }
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost:4200',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver'],
    framework: 'jasmine',
    reporters: ['spec'],
    jasmineOpts: {
      defaultTimeoutInterval: 60000,
      expectationResultHandler: function() { }
    }
  };