'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.messaging.messagingController', [])
      .controller('MessagingController', MessagingController);

  MessagingController.$inject = ["$rootScope", "$scope", "$location", "$window","MessagingService", "HeaderService", "CONST","UIUtilService", "CedarUser", "QueryParamUtilsService"];

  function MessagingController($rootScope, $scope, $location,$window, MessagingService, HeaderService, CONST, UIUtilService, CedarUser, QueryParamUtilsService) {

    $rootScope.pageTitle = 'Messaging';

    // Inject constants
    $scope.CONST = CONST;

    var pageId = CONST.pageId.MESSAGING;
    HeaderService.configure(pageId);

    $scope.toLocalDate = function (utcDate) {


      var y = utcDate.substring(0, 4);
      var m = utcDate.substring(5, 7);
      var d = utcDate.substring(9, 10);
      var h = 0;
      var m = 0;
      var s = 0;

      //console.log('toLocalDate' , utcDate, y, m, d, h, m, s);

      var date = new Date(y, m, d, h, m, s);
      var dateStr = date.toDateString();


      return utcDate;
    };

    $scope.goToDashboardOrBack = function () {
      //vm.searchTerm = null;
      UIUtilService.activeLocator = null;
      UIUtilService.activeZeroLocator = null;
      var path = $location.path();
      var hash = $location.hash();
      var baseUrl = '/dashboard';
      if (path != baseUrl) {
        var queryParams = {};
        var sharing = QueryParamUtilsService.getSharing();
        if (sharing) {
          queryParams['sharing'] = sharing;
        }
        var folderId = QueryParamUtilsService.getFolderId() || CedarUser.getHomeFolderId();
        if (folderId) {
          queryParams['folderId'] = folderId;
        }
        /*if (params.search) {
         queryParams['search'] = params.search;
         }*/
      }
      var url = $rootScope.util.buildUrl(baseUrl, queryParams);
      if (hash) {
        url += '#' + hash;
      }
      $location.url(url);
      $window.scrollTo(0, 0);

    };

    $scope.isRejected = function(message) {
      console.log('isRejected',message, message.toUpperCase(),message.toUpperCase().includes("REJECTED"));
      return message.toUpperCase().includes("REJECTED");
    };

    $scope.isUnread = function(message) {
      console.log('isUnread',message, message.toUpperCase(),message.toUpperCase().includes("unread"));
      return message.toUpperCase().includes("UNREAD");
    };



    MessagingService.loadMessages(function (userMessages) {
      //console.log("messages loaded:");
      //console.log(userMessages);
      $scope.userMessages = userMessages;
      if (userMessages.unread > 0) {
        MessagingService.markAllMessagesAsRead();
      }
    });

  }

});
