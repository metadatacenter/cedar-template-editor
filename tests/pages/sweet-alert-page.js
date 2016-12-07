'use strict';


var SweetAlertPage = function () {

  var EC = protractor.ExpectedConditions;

  // sweet alerts
  var createConfirmationDialog = element(by.css('.sweet-alert'));
  var sweetAlertCancelAttribute = 'data-has-cancel-button';
  var sweetAlertConfirmAttribute = 'data-has-confirm-button';
  var createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.cancel'));
  var createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.confirm'));


  this.createConfirmationDialog = function () {
    return createConfirmationDialog;
  };
  this.sweetAlertConfirmAttribute = function () {
    return sweetAlertConfirmAttribute;
  };
  this.sweetAlertCancelAttribute = function () {
    return sweetAlertCancelAttribute;
  };
  this.createSweetAlertCancelButton = function () {
    return createSweetAlertCancelButton;
  };
  this.createSweetAlertConfirmButton = function () {
    return createSweetAlertConfirmButton;
  };


  this.confirm = function() {

    browser.wait(EC.visibilityOf(createSweetAlertConfirmButton));
    browser.sleep(1000);  // TODO seems to need this
    browser.wait(EC.elementToBeClickable(createSweetAlertConfirmButton));
    createSweetAlertConfirmButton.click();

  };

  this.cancel = function() {

    browser.wait(EC.visibilityOf(createSweetAlertConfirmButton));
    browser.sleep(1000);  // TODO seems to need this
    browser.wait(EC.elementToBeClickable(createSweetAlertConfirmButton));
    createSweetAlertCancelButton.click();

  };

  this.isHidden = function() {

    browser.wait(EC.invisibilityOf(createConfirmationDialog));

  };



};
module.exports = new SweetAlertPage(); 
