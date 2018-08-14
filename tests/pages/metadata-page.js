'use strict';

//require('../pages/workspace-page.js');

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
  var topNavBackArrow = element(by.css('.back-arrow-click'));

  var lockIcon = element(by.css('#top-navigation .feedback-form i.fa-lock'));
  var dirtyIcon = element(by.css('#top-navigation .feedback-form i.fa-circle'));
  var validIcon = element(by.css('#top-navigation .feedback-form i.fa-check'));

  var showJsonLink = element(by.css('#document-preview  a.accordion-toggle'));
  var jsonPreview = element(by.id('form-json-preview'));

  var documentTitle = element(by.css('.document-title'));
  var pageTitle = element(by.id('top-navigation')).element(by.css('.navbar-header')).element(by.css('.navbar-back')).element(by.css('.page-title'));

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

  var createPageName = element(by.css('.navbar.metadata'));

  var metadataPageTitle = 'Metadata Editor';
  var createSaveMetadataButton = element(by.id('button-save-metadata'));
  var createCancelMetadataButton = element(by.id('button-cancel-metadata'));


  this.showJson = function () {
    browser.wait(EC.invisibilityOf(jsonPreview));
    browser.wait(EC.visibilityOf(showJsonLink));
    browser.wait(EC.elementToBeClickable(showJsonLink));
    showJsonLink.click();
    browser.wait(EC.visibilityOf(jsonPreview));
  };

  this.hideJson = function () {
    browser.wait(EC.visibilityOf(jsonPreview));
    browser.wait(EC.visibilityOf(showJsonLink));
    browser.wait(EC.elementToBeClickable(showJsonLink));
    showJsonLink.click();
    browser.wait(EC.invisibilityOf(jsonPreview));
  };

  this.isHiddenJson = function () {
    browser.wait(EC.invisibilityOf(jsonPreview));
  };


  this.get = function () {
    browser.get(url);
    //browser.sleep(1000);
  };
  this.getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  this.topNavigation = function () {
    return topNavigation;
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
  };

  this.isMetadata = function () {
    return element(by.css(cssNavMetadata)).isDisplayed();
  };

  this.createPageName = function () {
    return createPageName;
  };

  this.createNavMetadata = function () {
    return element(by.css(cssNavMetadata));
  };

  this.isDashboard = function () {
    return element(by.css(cssNavDashboard)).isDisplayed();
  };

  this.clickCancelMetadata = function () {
    createCancelMetadataButton.click();
  };


  this.createToastyConfirmationPopup = function () {
    return createToastyConfirmationPopup;
  };

  this.toastyMessageText = function () {
    return toastyMessageText;
  };

  this.createMetadataMessage = function () {
    return createMetadataMessage;
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

  this.isLocked = function () {
    browser.wait(EC.visibilityOf(lockIcon));
  };

  this.isDirty = function () {
    var dirtyIcon = element(by.css('#headerCtrl .feedback-form > span:nth-child(1) > i'));
    browser.wait(EC.visibilityOf(dirtyIcon));
  };

  // TODO not finding the validIcon
  this.isValid = function () {
    browser.wait(EC.visibilityOf(validIcon));
    //return true;
  };

  this.clickBackArrow = function () {
    var backArrow = element(by.css('.back-arrow-click'));
    browser.wait(EC.visibilityOf(backArrow));
    browser.wait(EC.elementToBeClickable(backArrow));
    topNavBackArrow.click();
  };


  // make sure the element is multiple instance and has fields in it
  this.checkMultiple = function() {
    // open the element
    var createElement = element(by.css('.elementTotalContent .element  .col-xs-6  .element'));
    browser.wait(EC.visibilityOf(createElement));
    browser.wait(EC.elementToBeClickable(createElement));
    createElement.click();

    // open the first field within the element
    var createField = element.all(by.css('.elementTotalContent .element  .title.field')).first();
    browser.wait(EC.visibilityOf(createField));
    browser.wait(EC.elementToBeClickable(createField));
    createField.click();

  };

  // add instance to multi-instance element, toggle view to expanded and make sure
  // it is property expanded
  this.addInstance = function() {

    // move the mouse to the element title
    var createElement = element(by.css('.elementTotalContent .element  .col-xs-6  .element'));
    browser.actions().mouseMove(createElement).perform();

    // click on the add button
    var createAdd = element(by.css('.elementTotalContent .element  button.add'));
    browser.wait(EC.visibilityOf(createAdd));
    browser.wait(EC.elementToBeClickable(createAdd));
    createAdd.click();

    // click on the expanded view button
    var createViewToggle = element(by.css('.elementTotalContent .element  button.view-toggle'));
    browser.wait(EC.visibilityOf(createViewToggle));
    browser.wait(EC.elementToBeClickable(createViewToggle));
    createViewToggle.click();

    var createElementList = element.all(by.css('cedar-runtime-element .element.title'));
    expect(createElementList.count()).toBe(2);

  };

  this.switchToSpreadsheet = function() {
    var activateField = element(by.css('div.title.isInactive'));
    browser.wait(EC.visibilityOf(activateField));
    browser.wait(EC.elementToBeClickable(activateField));
    activateField.click();

    var spreadsheet = element(by.css('div.ht_master.handsontable'));
    browser.wait(EC.visibilityOf(spreadsheet));

    var firstCell = element(by.css('div.ht_master.handsontable > div > div > div > table > tbody > tr:nth-child(1) > td'));
    browser.wait(EC.visibilityOf(firstCell));
    browser.wait(EC.elementToBeClickable(firstCell));
    firstCell.click().sendKeys('value').sendKeys(protractor.Key.ENTER);
  };


  this.addFieldValue = function() {
  }




};
module.exports = new MetadataPage(); 
