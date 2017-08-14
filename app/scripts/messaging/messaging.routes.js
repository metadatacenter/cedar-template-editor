define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.messaging.routes', [])
      .config(messagingRoutes);

  messagingRoutes.$inject = ['$routeProvider'];

  function messagingRoutes($routeProvider) {
    $routeProvider
        .when('/messaging', {
          templateUrl: 'scripts/messaging/messaging.html',
          controller : 'MessagingController'
        });
  }

});