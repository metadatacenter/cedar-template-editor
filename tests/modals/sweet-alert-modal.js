'use strict';


var SweetAlertModal = function () {

  var EC = protractor.ExpectedConditions;

  // sweet alerts
  var createConfirmationDialog = element(by.css('.sweet-alert'));
  var sweetAlertCancelAttribute = 'data-has-cancel-button';
  var sweetAlertConfirmAttribute = 'data-has-confirm-button';
  var createSweetAlertCancelButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(
      by.css('.cancel'));
  var createSweetAlertConfirmButton = element(by.css('.sweet-alert')).element(by.css('.sa-button-container')).element(
      by.css('.confirm'));
  var message = element.all(by.css('div.sweet-alert > p')).first();
  var warning = 'div.sweet-alert.visible > div.sa-warning.pulseWarning';
  var warningMessage = element(by.css(warning));

  var folderNotEmpty = "The folder cannot be deleted.";
  var insufficientRightsMessagePartial = "You do not have write access";
  var insufficientPermission = "do not have permission";
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

  this.cancel = function () {

    browser.wait(EC.visibilityOf(createSweetAlertConfirmButton));
    browser.sleep(1000);  // TODO  wait for animation
    browser.wait(EC.elementToBeClickable(createSweetAlertConfirmButton));
    createSweetAlertCancelButton.click();

  };

  this.isHidden = function () {
    browser.wait(EC.invisibilityOf(createConfirmationDialog));
  };

  this.noReadAccess = function () {
    browser.wait(EC.visibilityOf(message));
    message.getText().then(function (text) {
      console.log('noReadAccess', text, insufficientPermission);
      expect(text).toContain(insufficientPermission);
    });
  };

  this.folderNotEmpty = function () {
    browser.wait(EC.visibilityOf(message));
    message.getText().then(function (text) {
      console.log('folderNotEmpty', text, folderNotEmpty);
      expect(text).toContain(folderNotEmpty);
    });
  };

  this.noWriteAccess = function () {
    browser.sleep(1000);  // TODO  wait for animation
    browser.wait(EC.visibilityOf(message));
    message.getText().then(function (text) {
      console.log('noWriteAccess', text, insufficientPermission);
      expect(text).toContain(insufficientPermission);
    });
  };


};
module.exports = new SweetAlertModal(); 
