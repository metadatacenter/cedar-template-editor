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

    $scope.toLocalDate = function(utcDate) {


      var y = utcDate.substring(0,4);
      var m = utcDate.substring(5,7);
      var d = utcDate.substring(9,10);
      var h = 0;
      var m = 0;
      var s = 0;

      //console.log('toLocalDate' , utcDate, y, m, d, h, m, s);

      var date = new Date(y, m, d, h, m, s);
      var dateStr = date.toDateString();



      return utcDate;
    };

    MessagingService.loadMessages(function (userMessages) {
      $scope.userMessages = userMessages;
    });



  }

});
