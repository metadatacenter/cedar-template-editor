//var testConfig = require('./tests/env.js');
var testConfig = require('./tests/config/test-env.js');

exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/selenium-standalone/.selenium/selenium-server/' + testConfig.seleniumServerJar,
  chromeDriver     : './node_modules/selenium-standalone/.selenium/chromedriver/' + testConfig.chromeDriver,
  specs            : ['tests/e2e/**/*.js'],

  onPrepare: function () {
    // implicit and page load timeouts
    browser.manage().timeouts().pageLoadTimeout(40000);
    browser.manage().timeouts().implicitlyWait(2500);

    browser.ignoreSynchronization = true;

    // sign in before all tests
    browser.driver.get(testConfig.baseUrl);


    var disableNgAnimate = function () {
      angular
          .module('disableNgAnimate', [])
          .run(['$animate', function ($animate) {
            $animate.enabled(false);
          }]);
    };

    var disableCssAnimate = function () {
      angular
          .module('disableCssAnimate', [])
          .run(function () {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '* {' +
                '-webkit-transition: none !important;' +
                '-moz-transition: none !important' +
                '-o-transition: none !important' +
                '-ms-transition: none !important' +
                'transition: none !important' +
                '}';
            document.getElementsByTagName('head')[0].appendChild(style);
          });
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);
    browser.addMockModule('disableCssAnimate', disableCssAnimate);


    browser.driver.findElement(by.id('username')).sendKeys(testConfig.testUser);
    browser.driver.findElement(by.id('password')).sendKeys(testConfig.testPassword);
    browser.driver.findElement(by.id('kc-login')).click();

    // wait for new page
    return browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return url == testConfig.baseUrl + '/';
      });
    }, 10000);

  }

};
