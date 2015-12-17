'use strict';

var UIMessageService = function (toasty, $translate) {

  var service = {
    serviceId: "UIMessageService"
  };

  service.flashSuccess = function (messageKey, messageParameters, title) {
    this.flash('success', messageKey, messageParameters, title);
  };

  service.flash = function (type, messageKey, messageParameters, title) {
    $translate(messageKey, messageParameters).then(function (message) {
      toasty[type]({
        title: title,
        msg: message
      });
    });
  };

  return service;
};

UIMessageService.$inject = ['toasty', '$translate'];
angularApp.service('UIMessageService', UIMessageService);