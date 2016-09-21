'use strict';

require('../pages/workspace-page.js');

var MetadataPage = function () {
  //var url = 'https://cedar.metadatacenter.orgx/dashboard';
  var testConfig = require('../config/test-env.js');
  var url = testConfig.baseUrl + '/dashboard';
  var EC = protractor.ExpectedConditions;

  var createToastyConfirmationPopup = element(by.id('toasty'));
  //var createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toasty-test-success'));
  var createMetadataMessage = 'The metadata have been created.';
  var toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));

  var topNavigation = element(by.id('top-navigation'));
  var topNavBackArrow = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.back-arrow-click'));
  var documentTitle = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.navbar-back')).element(by.css('.document-title'));
  var pageTitle = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.navbar-back')).element(by.css('.page-title'));
  var templateJson = element(by.id('show-json-link'));
  var metadataJson = element(By.css('#jsonTools a:nth-child(1)'));
  var firstItemTitle = element(by.css('.item-root')).element(by.model('model[\'@value\']'));
  var sampleTitle = 'sample title';
  var deleteTemplateMessage = 'The template has been deleted.';

  var createConfirmationDialog = element(by.css('.sweet-alert'));
  var sweetAlertCancelAttribute = 'data-has-cancel-button';
  var sweetAlertConfirmAttribute = 'data-has-confirm-button';
  var sweetAlertDoneAttribute = 'data-has-done-function';
  var createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('button.cancel'));
  var createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('button.confirm'));


  var cssNavDashboard = '.navbar.dashboard';
  var cssNavMetadata = '.navbar.metadata';

  var metadataPageTitle = 'Metadata Editor';
  var createSaveMetadataButton = element(by.id('button-save-metadata'));
  var createCancelMetadataButton = element(by.id('button-cancel-metadata'));


  this.get = function () {
    browser.get(url);
    browser.sleep(1000);
  };
  this.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };


  this.test = function () {
    console.log('metadata  page test');
  };

  this.topNavigation = function () {
    return topNavigation;
  };
  this.topNavBackArrow = function () {
    return topNavBackArrow;
  };
  this.documentTitle = function () {
    return documentTitle;
  };
  this.pageTitle = function () {
    return pageTitle;
  };
  this.templateJson = function () {
    return templateJson;
  };
  this.metadataJson = function () {
    return metadataJson;
  };
  this.firstItemTitle = function () {
    return firstItemTitle;
  };
  this.sampleTitle = function () {
    return sampleTitle;
  };
  this.metadataPageTitle = function () {
    return metadataPageTitle;
  };
  this.deleteTemplateMessage = function () {
    return deleteTemplateMessage;
  };
  this.createCancelMetadataButton = function () {
    return createCancelMetadataButton;
  };
  this.createSaveMetadataButton = function () {
    return createSaveMetadataButton;
  }


  this.isMetadata = function () {
    return element(by.css(cssNavMetadata)).isDisplayed();
  };

  this.isDashboard = function () {
    return element(by.css(cssNavDashboard)).isDisplayed();
  };

  this.clickCancelMetadata = function () {
    createCancelMetadataButton.click();
  };

  this.clickBackArrowMetadata = function () {
    element(by.css('.back-arrow-click')).click();
  };

  this.clickCancel = function (cancel) {
    var deferred = protractor.promise.defer();

    var confirm = createSweetAlertConfirmButton;

    cancel.click();

    browser.wait(createConfirmationDialog.isPresent()).then(function () {
      browser.wait(createConfirmationDialog.isDisplayed()).then(function () {

        browser.wait(EC.elementToBeClickable(confirm)).then(function () {
          browser.sleep(1000);
          confirm.click();
          deferred.fulfill(true);

        });
      });
    });

    return deferred.promise;

  };


  this.clickSaveMetadata = function () {
    var deferred = protractor.promise.defer();


    // click save the template
    element(by.css('.edit-actions button.btn.btn-save.metadata')).click();

    browser.wait(createToastyConfirmationPopup.isPresent()).then(function () {
      browser.wait(createToastyConfirmationPopup.isDisplayed()).then(function () {

        toastyMessageText.getText().then(function (value) {
          expect(value.indexOf(createMetadataMessage) !== -1).toBe(true);
          deferred.fulfill(true);
        });
      });
    });
    return deferred.promise;
  };

  // sweet
  this.createConfirmationDialog = function () {
    return createConfirmationDialog;
  };

  this.sweetAlertCancelAttribute = function () {
    return sweetAlertCancelAttribute;
  };

  this.sweetAlertDoneAttribute = function () {
    return sweetAlertDoneAttribute;
  };

  this.sweetAlertConfirmAttribute = function () {
    return sweetAlertConfirmAttribute;
  };

  this.clickSweetConfirm = function () {
    element(by.css(sweetAlertConfirmAttribute)).click();
  };

};
module.exports = new MetadataPage(); 
