'use strict';

define([
  'angular',
  'json!config/messaging-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.messagingService', [])
      .service('MessagingService', MessagingService);

  MessagingService.$inject = ['$interval', 'HttpBuilderService', 'UrlService', 'AuthorizedBackendService',
                              'UIMessageService'];

  function MessagingService($interval, HttpBuilderService, UrlService, AuthorizedBackendService,
                            UIMessageService) {

    var delay = null;
    var unreadCount = 0;

    var service = {
      serviceId: "MessagingService"
    };

    service.init = function () {
      delay = config.delay;
      $interval(this.messagingBeat, delay);
    };

    service.messagingBeat = function () {
      var url = UrlService.messagingSummary();
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(url),
          function (response) {
            service.unreadCount = response.data.unread;
          },
          function (error) {
            console.log("The messaging server is not responding!");
            //UIMessageService.showBackendError('SERVER.MESSAGING.load.error', error);
          }
      );
    };

    return service;
  }

});
