var testConfig = require('./tests/config/test-env.js');

exports.config = {
  // seleniumAddress: 'http://localhost:4444/wd/hub',
  directConnect    : true,
  seleniumServerJar: './node_modules/selenium-standalone/.selenium/selenium-server/' + testConfig.seleniumServerJar,
  chromeDriver     : './node_modules/selenium-standalone/.selenium/chromedriver/' + testConfig.chromeDriver,
  specs            : ['tests/e2e/**/*.js'],
  allScriptsTimeout: 40000,
  capabilities: {
    'browserName': 'chrome'
  },

  onPrepare: function () {
    // implicit and page load timeouts
    browser.manage().timeouts().pageLoadTimeout(40000);
    browser.manage().timeouts().implicitlyWait(20000);

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

    browser.driver.findElement(by.id('username')).sendKeys(testConfig.testUser1).then(function () {
      browser.driver.findElement(by.id('password')).sendKeys(testConfig.testPassword1).then(function () {
        browser.driver.findElement(by.id('kc-login')).click().then(function () {
          browser.driver.wait(browser.driver.isElementPresent(by.id('top-navigation')));

        });
      });
    });

    // wait for new page
    return browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        browser.ignoreSynchronization = false;
        return url === testConfig.baseUrl + '/';
      });
    }, 20000);


  }
};
