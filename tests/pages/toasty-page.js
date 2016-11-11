'use strict';


var ToastyPage = function () {



  // toasty
 var createToastyConfirmationPopup = element(by.id('toasty'));
  var createToastySuccess = element(by.id('toasty')).element(by.css('.toasty-type-success'));
  var createToastyToasts = element.all(by.css('.toast'));
  var createToastyToast = createToastyToasts.first();
  var createToastyMessage = createToastyToast.element(by.css('.toast-msg'));
  var createToastyClose = createToastyConfirmationPopup.element(by.css('.close-button'));


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

            console.log('toast message ' + value);
            //expect(value.indexOf(text) !== -1).toBe(true);

            createToastyClose.click().then(function () {
              deferred.fulfill(true);

            });
          });
        });
      });

    return deferred.promise;
  };




};
module.exports = new ToastyPage(); 
