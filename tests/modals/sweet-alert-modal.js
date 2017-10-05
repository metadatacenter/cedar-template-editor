'use strict';


var SweetAlertModal = function () {

  var EC = protractor.ExpectedConditions;

  // sweet alerts
  var createConfirmationDialog = element(by.css('.sweet-alert'));
  var sweetAlertCancelAttribute = 'data-has-cancel-button';
  var sweetAlertConfirmAttribute = 'data-has-confirm-button';
  var createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.cancel'));
  var createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(by.css('.confirm'));
  var message = element.all(by.css('div.sweet-alert > p')).first();

  var insufficientRightsMessagePartial = "You do not have write access";
  var noWriteAccessMessagePartial = "The template may not be modified because there are metadata using it.";


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
    browser.sleep(1000);  // TODO  wait for animation
    browser.wait(EC.elementToBeClickable(createSweetAlertConfirmButton));
    createSweetAlertConfirmButton.click();

  };

  this.cancel = function() {

    browser.wait(EC.visibilityOf(createSweetAlertConfirmButton));
    browser.sleep(1000);  // TODO  wait for animation
    browser.wait(EC.elementToBeClickable(createSweetAlertConfirmButton));
    createSweetAlertCancelButton.click();

  };

  this.isHidden = function() {
    browser.wait(EC.invisibilityOf(createConfirmationDialog));
  };

  this.hasInsufficientPermissions = function () {
    browser.wait(EC.visibilityOf(message));
    message.getText().then(function(text) {
      expect(text).toContain(insufficientRightsMessagePartial);
    });
  };

  this.noWriteAccess = function () {
    browser.sleep(1000);  // TODO  wait for animation
    browser.wait(EC.visibilityOf(message));
    message.getText().then(function(text) {
      console.log('message',text);
      expect(text).toContain(noWriteAccessMessagePartial);
    });
  };


};
module.exports = new SweetAlertModal(); 
