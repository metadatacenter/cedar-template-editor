'use strict';

define(['angular'], function (angular) {
  angular.module('cedar.templateEditor.groups.routes', [])
      .config(groupsRoutes);

  groupsRoutes.$inject = ['$routeProvider'];

  function groupsRoutes($routeProvider) {
    $routeProvider.when('/groups', {
      templateUrl: 'scripts/groups/groups.html',
      controller: 'GroupsController',
      controllerAs: 'groups'
    });
  }
});
