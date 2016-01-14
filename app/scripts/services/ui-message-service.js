'use strict';

var UIMessageService = function (toasty, $translate) {

  var service = {
    serviceId: "UIMessageService"
  };

  service.flashSuccess = function (messageKey, messageParameters, title) {
    this.flash('success', messageKey, messageParameters, title);
  };

  service.flash = function (type, messageKey, messageParameters, titleKey) {
    toasty[type]({
      title: $translate.instant(titleKey),
      msg: $translate.instant(messageKey, messageParameters)
    });
  };

  service.conditionalOrConfirmedExecution = function (condition, callback, titleKey, textKey, confirmTextKey) {
    if (condition) {
      callback();
    } else {
      swal({
          title: $translate.instant(titleKey),
          text: $translate.instant(textKey),
          type: "warning",
          showCancelButton: true,
          confirmButtonText: $translate.instant(confirmTextKey),
          closeOnConfirm: true,
          customClass: 'cedarSWAL',
          confirmButtonColor: null
        },
        function (isConfirm) {
          if (isConfirm) {
            callback();
          }
        }
      );
    }
  };

  service.confirmedExecution = function (callback, titleKey, textKey, confirmTextKey) {
    swal({
        title: $translate.instant(titleKey),
        text: $translate.instant(textKey),
        type: "warning",
        showCancelButton: true,
        confirmButtonText: $translate.instant(confirmTextKey),
        closeOnConfirm: true,
        customClass: 'cedarSWAL',
        confirmButtonColor: null
      },
      function (isConfirm) {
        if (isConfirm) {
          callback();
        }
      });
  };

  return service;
};

UIMessageService.$inject = ['toasty', '$translate'];
angularApp.service('UIMessageService', UIMessageService);