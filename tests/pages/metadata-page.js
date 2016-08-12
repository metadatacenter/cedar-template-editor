'use strict';

require ('../pages/workspace-page.js');

var MetadataPage = function () {
  var url = 'https://cedar.metadatacenter.orgx/dashboard';

  this.topNavigation = element(by.id('top-navigation'));
  this.topNavBackArrow = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.back-arrow-click'));
  this.documentTitle = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.navbar-back')).element(by.css('.document-title'));
  this.pageTitle = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.navbar-back')).element(by.css('.page-title'));
  this.templateJson = element(by.id('show-json-link'));
  this.metadataJson = element(By.css('#jsonTools a:nth-child(1)'));
  this.firstItemTitle = element(by.css('.item-root')).element(by.model('model._value'));
  this.sampleTitle = 'sample title';
  this.deleteTemplateMessage = 'The template has been deleted.';
  this.createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toast'));


  var cssNavDashboard = '.navbar.dashboard';
  var cssNavMetadata = '.navbar.metadata';

  this.metadataPageTitle = 'Metadata Editor';


  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  };


  this.test = function() {
    console.log('metadata  page test');
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

    var EC = protractor.ExpectedConditions;
    var createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toast'));
    var createMetadataMessage = 'The metadata have been created.';
    var toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));

    // click save the template
    element(by.css('.edit-actions button.btn.btn-save.metadata')).click();

    browser.wait(EC.visibilityOf(createToastyConfirmationPopup), 10000);
    expect(createToastyConfirmationPopup.isDisplayed()).toBe(true);
    toastyMessageText.getText().then(function (value) {
      expect(value.indexOf(createMetadataMessage) !== -1).toBe(true);
    });
  };

};
module.exports = new MetadataPage(); 
