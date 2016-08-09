'use strict';

require('../pages/template-creator-page.js');
require('../pages/metadata-page.js');

var DashboardPage = function () {
  var url = 'https://cedar.metadatacenter.orgx/dashboard';
  var EC = protractor.ExpectedConditions;

  var createButton = element(by.id('button-create'));
  var createElementButton = element(by.id('button-create-element'));
  var createTemplateButton = element(by.id('button-create-template'));

  this.sampleTemplateTitle = 't';
  this.sampleTemplateDescription = 't';
  this.sampleElementTitle = 's';
  this.sampleElementDescription = 's';

  this.createToastyConfirmationPopup = element(by.id('toasty')).element(by.css('.toast'));
  this.toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));
  this.createConfirmationDialog = element(by.css('.sweet-alert'));
  this.sweetAlertCancelAttribute = 'data-has-cancel-button';
  this.sweetAlertConfirmAttribute = 'data-has-confirm-button';
  this.createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.cancel'));
  this.createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.confirm'));
  this.templateJSON = element(by.id('templateJSON'));
  this.topNavigation = element(by.id('top-navigation'));
  this.topNavButtons = element.all(by.css('.controls-bar .list-inline li button'));
  this.deleteTemplateMessage = 'The template has been deleted.';
  this.deleteButtonTooltip = 'delete selection';

  this.template = 'template';
  this.dashboard = 'dashboard';
  this.element = 'element';


  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  };

  this.test = function () {
    console.log('dashboard page test');
  };

  this.getFirstElement = function () {
    var firstElement = element.all(by.css('.form-box')).first();
    return firstElement;
  };

  // open the template by title
  this.openTemplate = function (title) {
    var deferred = protractor.promise.defer();
    var EC = protractor.ExpectedConditions;

    var searchInput = element(by.id('search'));
    searchInput.sendKeys(title).then(function () {

      // click the search submit icon
      element(by.css('.do-search')).click().then(function () {

        var firstItem = element.all(by.css('.form-box')).first();
        browser.wait(EC.visibilityOf(firstItem), 10000);

        // the search browse modal should show some results
        expect(firstItem.isPresent()).toBe(true);

        firstItem.click().then(function () {
          browser.actions().doubleClick(firstItem).perform();
          deferred.fulfill(true);
        });
      });
    });
    return deferred.promise;
  };

  // create a new template
  this.createTemplate = function () {
    browser.actions().mouseMove(createButton).perform();
    createTemplateButton.click();
    return require('./template-creator-page.js');
  };

  // create a new element
  this.createElement = function () {
    browser.actions().mouseMove(createButton).perform();
    createElementButton.click();
    return require('./template-creator-page.js');
  };


  this.clickSweetAlertCancelButton = function () {
    this.createSweetAlertCancelButton.click();
    browser.sleep(1000);
  };
  this.clickSweetAlertConfirmButton = function () {
    this.createSweetAlertConfirmButton.click();
    browser.sleep(1000);
  };
  this.getToastyMessageText = function () {
    return this.toastyMessageText.getText();
  };
  this.hasClass = function (element, cls) {
    return element.getAttribute('class').then(function (classes) {
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };

};
module.exports = new DashboardPage(); 
