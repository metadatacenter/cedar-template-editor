var testConfig = require('./tests/env.js');

exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/selenium-standalone/.selenium/selenium-server/' + testConfig.seleniumServerJar,
  chromeDriver: './node_modules/selenium-standalone/.selenium/chromedriver/' + testConfig.chromeDriver,
  specs: ['tests/e2e/**/*.js'],

  onPrepare: function() {
    // implicit and page load timeouts
    browser.manage().timeouts().pageLoadTimeout(40000);
    browser.manage().timeouts().implicitlyWait(2500);

    browser.ignoreSynchronization = true;

    // sign in before all tests
    browser.driver.get(testConfig.baseUrl);

    browser.driver.findElement(by.id('username')).sendKeys(testConfig.testUser);
    browser.driver.findElement(by.id('password')).sendKeys(testConfig.testPassword);
    browser.driver.findElement(by.id('kc-login')).click();

    // wait for new page
    return browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        return url == testConfig.baseUrl + '/';
      });
    }, 10000);

  }

};
