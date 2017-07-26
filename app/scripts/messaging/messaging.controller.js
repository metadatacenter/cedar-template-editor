'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.messaging.messagingController', [])
      .controller('MessagingController', MessagingController);

  MessagingController.$inject = ["$rootScope", "$scope", "MessagingService", "HeaderService", "CONST"];

  function MessagingController($rootScope, $scope, MessagingService, HeaderService, CONST) {

    $rootScope.pageTitle = 'Messaging';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.MESSAGING;
    HeaderService.configure(pageId);

    MessagingService.loadMessages(function (userMessages) {
      console.log("messages loaded:");
      console.log(userMessages);
      $scope.userMessages = userMessages;
    });

  }

});
