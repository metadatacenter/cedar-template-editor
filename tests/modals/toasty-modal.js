'use strict';


var ToastyModal = function () {

  var EC = protractor.ExpectedConditions;

  // toasty
  var createToastyConfirmationPopup = element(by.id('toasty'));
  var createToastySuccesses = element.all(by.css('#toasty .toast.toasty-type-success'));
  var createToastySuccess = createToastySuccesses.first();
  var createToastyErrors = element.all(by.css('#toasty .toast.toasty-type-error'));
  var createToastyError = createToastyErrors.first();
  var createToastyToasts = element.all(by.css('#toasty .toast'));
  var createToastyToast = createToastyToasts.first();
  var createToastyMessage = createToastyToast.element(by.css('.toast-msg'));
  var createToastyClose = element.all(by.css('#toasty .toast .close-button')).first();
  var toastyFolderMessage = "The folder ";
  var toastyTemplateMessage = "The template ";
  var toastyElementMessage = "The element ";
  var toastyMessage = "The ";
  var toastyMessageCreated = " has been created.";
  var toastyMessageDeleted = " has been deleted.";


  // look for the first toast to be a success
  this.isSuccess = function () {

    // toasty is blocked because of animations, so we need to turn off synchronization to click the close
    browser.sleep(500);
    browser.ignoreSynchronization = true;

    // is it a success?
    expect(createToastySuccess.isPresent()).toBe(true);

    // close the toast
    var toastyClose = element(by.css('#toasty .toast .close-button'));
    toastyClose.click();

    browser.sleep(500);
    browser.ignoreSynchronization = false;
  };

  // look for the first toast to be an error
  this.isError = function () {
    browser.sleep(500);
    browser.ignoreSynchronization = true;

    // is it an error?
    expect(createToastyError.isPresent()).toBe(true);

    // close the toast
    var toastyClose = element(by.css('#toasty .toast .close-button'));
    toastyClose.click();

    browser.sleep(500);
    browser.ignoreSynchronization = false;
  };

  // look for the first toast to be a success
  this.isMessage = function (message) {

    // toasty is blocked because of animations, so we need to turn off synchronization to read the message
    browser.sleep(500);
    browser.ignoreSynchronization = true;

    // read the message
    createToastyMessage.getAttribute('value').then(function (v) {
      console.log('value ' + v);
      result = (message === v);
    });

    browser.sleep(500);
    browser.ignoreSynchronization = false;
    return result;
  };


};
module.exports = new ToastyModal(); 
