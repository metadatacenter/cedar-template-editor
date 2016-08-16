'use strict';

require ('../pages/workspace-page.js');

var MetadataPage = function () {
  //var url = 'https://cedar.metadatacenter.orgx/dashboard';
  var testConfig = require('../config/test-env.js');
  var url = testConfig.baseUrl + '/dashboard';

  var createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toast'));
  var createMetadataMessage = 'The metadata have been created.';
  var toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));

  var topNavigation = element(by.id('top-navigation'));
  var topNavBackArrow = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.back-arrow-click'));
  var documentTitle = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.navbar-back')).element(by.css('.document-title'));
  var pageTitle = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.navbar-back')).element(by.css('.page-title'));
  var templateJson = element(by.id('show-json-link'));
  var metadataJson = element(By.css('#jsonTools a:nth-child(1)'));
  var firstItemTitle = element(by.css('.item-root')).element(by.model('model._value'));
  var sampleTitle = 'sample title';
  var deleteTemplateMessage = 'The template has been deleted.';


  var cssNavDashboard = '.navbar.dashboard';
  var cssNavMetadata = '.navbar.metadata';

  var metadataPageTitle = 'Metadata Editor';


  this.get = function () {
    browser.get(url);
    browser.sleep(1000);
  };


  this.test = function() {
    console.log('metadata  page test');
  };

  this.topNavigation = function() {
    return topNavigation;
  };
  this.topNavBackArrow = function() {
    return topNavBackArrow;
  };
  this.documentTitle = function() {
    return documentTitle;
  };
  this.pageTitle = function() {
    return pageTitle;
  };
  this.templateJson = function() {
    return templateJson;
  };
  this.metadataJson = function() {
    return metadataJson;
  };
  this.firstItemTitle = function() {
    return firstItemTitle;
  };
  this.sampleTitle = function() {
    return sampleTitle;
  };
  this.metadataPageTitle = function() {
    return metadataPageTitle;
  };
  this.deleteTemplateMessage = function() {
    return deleteTemplateMessage;
  };


  this.isMetadata = function() {
    return element(by.css(cssNavMetadata)).isDisplayed();
  };

  this.isDashboard = function() {
    return element(by.css(cssNavDashboard)).isDisplayed();
  };

  this.clickCancelMetadata = function () {
    element(by.css('.back-arrow-click')).click();
    return require('./workspace-page.js');
  };

  this.clickSaveMetadata = function () {

    // click save the template
    element(by.css('.edit-actions button.btn.btn-save.metadata')).click();

    browser.wait(createToastyConfirmationPopup.isDisplayed());
    //browser.wait(EC.visibilityOf(createToastyConfirmationPopup), 10000);
    //expect(createToastyConfirmationPopup.isDisplayed()).toBe(true);
    toastyMessageText.getText().then(function (value) {
      expect(value.indexOf(createMetadataMessage) !== -1).toBe(true);
    });
  };

};
module.exports = new MetadataPage(); 
