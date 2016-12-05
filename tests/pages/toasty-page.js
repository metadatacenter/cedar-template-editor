'use strict';


var ToastyPage = function () {

  var EC = protractor.ExpectedConditions;

  // toasty
 var createToastyConfirmationPopup = element(by.id('toasty'));
  var createToastySuccesses = element.all(by.css('#toasty .toast.toasty-type-success'));
  var createToastySuccess = createToastySuccesses.first();
  var createToastyToasts = element.all(by.css('#toasty .toast'));
  var createToastyToast = createToastyToasts.first();
  var createToastyMessage = createToastyToast.element(by.css('.toast-msg'));
  var createToastyClose = element.all(by.css('#toasty .toast .close-button')).first();


  var isReady = function (elm) {
    var deferred = protractor.promise.defer();

    browser.wait(elm.isPresent()).then(function () {
      browser.wait(elm.isDisplayed()).then(function () {
        deferred.fulfill(true);
      });
    });

    return deferred.promise;
  };

  // toasty
  this.isToasty = function () {
    var deferred = protractor.promise.defer();
    isReady(createToastySuccess).then(function () {


      createToastyToasts.each(function (toast) {

          var message = toast.element(by.css('.toast-msg'));
          message.getText().then(function (value) {

            //expect(value.indexOf(text) !== -1).toBe(true);

            createToastyClose.click().then(function () {
              deferred.fulfill(true);

            });
          });
        });
      });

    return deferred.promise;
  };

  this.isToastyNew = function () {
    browser.sleep(500);
    browser.ignoreSynchronization = true;
    var toast = element(by.css('#toasty .toast .toast-msg'));
    toast.getAttribute('value').then(function (v) {
      console.log(v);
    });
    var toastyClose = element(by.css('#toasty .toast .close-button'));
    toastyClose.click();
    element(by.css('.navbar-brand')).click();

    browser.sleep(500);
    browser.ignoreSynchronization = false;
  };


  this.isSuccess = function () {

    browser.wait(EC.presenceOf(element.all(by.css('.toast')).first()));
    //browser.wait(EC.visibilityOf(createToastyClose));
    //browser.wait(EC.elementToBeClickable(createToastyClose));
    //createToastyClose.click();
  };


};
module.exports = new ToastyPage(); 
