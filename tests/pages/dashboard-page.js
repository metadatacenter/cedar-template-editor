'use strict';

require ('../pages/template-creator-page.js');

var DashboardPage = function () {
  var url = 'https://cedar.metadatacenter.orgx/dashboard';

  var createButton = element(by.id('button-create'));
  var createElementButton = element(by.id('button-create-element'));
  var createTemplateButton = element(by.id('button-create-template'));

  this.createToastyConfirmationPopup =  element(by.id('toasty')).element(by.css('.toast'));
  this.toastyMessageText = element(by.id('toasty')).element(by.css('.toast')).element(by.css('.toast-msg'));
  this.createConfirmationDialog = element(by.css('.sweet-alert'));
  this.sweetAlertCancelAttribute = 'data-has-cancel-button';
  this.sweetAlertConfirmAttribute = 'data-has-confirm-button';
  this.createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.cancel'));
  this.createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.confirm'));
  this.templateJSON = element(by.id('templateJSON'));
  this.topNavigation = element(by.id('top-navigation'));

  this.template = 'template';
  this.dashboard = 'dashboard';
  this.element = 'element';


  this.get = function () {
    browser.get(url);
// wait until loaded 
// TODO: should use EC for this 
    browser.sleep(1000);
  };

 this.test = function() {
   console.log('dashboard page test');
 };

  this.createTemplate = function () {
    browser.actions().mouseMove(createButton).perform();
    createTemplateButton.click();
    return require('./template-creator-page.js');
  };

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
