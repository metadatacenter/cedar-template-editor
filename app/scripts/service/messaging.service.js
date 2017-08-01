'use strict';

define([
  'angular',
  'json!config/messaging-service.conf.json'
], function (angular, config) {
  angular.module('cedar.templateEditor.service.messagingService', [])
      .service('MessagingService', MessagingService);

  MessagingService.$inject = ['$interval', '$timeout', 'HttpBuilderService', 'UrlService', 'AuthorizedBackendService',
                              'UIMessageService'];

  function MessagingService($interval, $timeout, HttpBuilderService, UrlService, AuthorizedBackendService,
                            UIMessageService) {

    var delay = null;
    var unreadCount = 0;
    var notNotifiedCount = 0;

    var service = {
      serviceId: "MessagingService"
    };

    service.init = function () {
      delay = config.delay;
      this.messagingBeat();
      $interval(this.messagingBeat, delay);
    };

    service.messagingBeat = function () {

      var url = UrlService.messagingSummary();
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(url),
          function (response) {
            service.unreadCount = response.data.unread;
            service.notNotifiedCount = response.data.notnotified;
            if (service.notNotifiedCount > 0) {
              //console.log("notNotifiedCount > 0");
              service.readAndNotify();
            }
          },
          function (error) {
            console.log("The messaging server is not responding!");
          }
      );
    };

    service.loadMessages = function (callback) {
      //console.log('loadMesssages');
      var url = UrlService.messagingMessages();
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(url),
          function (response) {
            callback(response.data);
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.MESSAGING.load.error', error);
          }
      );
    };

    service.markAllMessagesAsRead = function() {
      var url = UrlService.messagingMarkAllMessagesAsRead();
      AuthorizedBackendService.doCall(
          HttpBuilderService.post(url),
          function (response) {
            // do nothing
          },
          function (error) {
            UIMessageService.showBackendError('SERVER.MESSAGING.load.error', error);
          }
      );
    };

    service.readAndNotify = function (callback) {
      //console.log('readAndNotify');
      var url = UrlService.messagingNotNotifiedMessages();
      AuthorizedBackendService.doCall(
          HttpBuilderService.get(url),
          function (response) {
            //console.log("readAndNotify response:");
            //console.log(response.data);
            service.showNotifications(response.data);
          },
          function (error) {
            console.log("The messaging server is not responding!");
          }
      );
    };

    service.showNotifications = function (data) {
      //console.log('showNotifications');
      var messages = data.messages;
      messages.forEach(function (msg) {
        //console.log("flush");
        UIMessageService.flashMessageNotification(msg);
        //console.log("markMessageAsNotified:");
        //console.log(msg)
        service.markMessageAsNotified(msg);
      });
    };

    service.markMessageAsNotified = function (msg) {
      //console.log('markMessageAsNotified');
      var url = UrlService.messagingPatchMessage(msg['id']);
      var patch = {
        'notificationStatus': 'notified'
      };
      //console.log("url to patch:" + url);
      AuthorizedBackendService.doCall(
          HttpBuilderService.patchMerge(url, patch),
          function (response) {
            // do nothing
            //console.log("PATCHED");
          },
          function (error) {
            console.log("The messaging server is not responding!");
          }
      );

    };

    return service;
  }

});
