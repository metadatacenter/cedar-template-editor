exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/selenium-standalone/.selenium/selenium-server/2.47.1-server.jar',
  chromeDriver: './node_modules/selenium-standalone/.selenium/chromedriver/2.18-x64-chromedriver',
  specs: ['tests/e2e/**/*.js']
};
