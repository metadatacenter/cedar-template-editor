var testConfig = require('./tests/config/test-env.js');

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs          : ['tests/e2e/**/*.js'],
  rootElement    : 'html',
 // directConnect  : true,

  capabilities: {
    browserName   : 'chrome',
    shardTestFiles: false,
    maxInstances  : 1
  },

  allScriptsTimeout: 500000,
  jasmineNodeOpts  : {
    showColors            : true,
    defaultTimeoutInterval: 500000,
    isVerbose             : true
  },

  onPrepare: function () {
    // implicit and page load timeouts
    browser.manage().timeouts().pageLoadTimeout(100000);
    browser.manage().timeouts().implicitlyWait(5000);
    browser.driver.manage().window().maximize();

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

    browser.manage().logs().get('browser').then(function (browserLogs) {
      // browserLogs is an array of objects with level and message fields
      browserLogs.forEach(function (log) {
        //if (log.level.value > 900) { // it's an error log
        console.log('Browser console error!');
        console.log(log.message);
        //}
      });
    });


    browser.driver.findElement(by.id('username')).sendKeys(testConfig.testUser1).then(function () {
      browser.driver.findElement(by.id('password')).sendKeys(testConfig.testPassword1).then(function () {
        browser.driver.findElement(by.id('kc-login')).click().then(function () {
          //browser.driver.wait(browser.driver.isElementPresent(by.id('top-navigation')));
          browser.driver.findElements(By.id('top-navigation')).then(function (found) {
            console.log(found.length);
          });
        });
      });
    });

    // wait for new page
    return browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return browser.driver.findElements(by.className('ng-app')).then(function () {
          browser.ignoreSynchronization = false;
          return true;
        });

      });
    });


  }
};
