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

  return service;
};

UIMessageService.$inject = ['toasty', '$translate'];
angularApp.service('UIMessageService', UIMessageService);