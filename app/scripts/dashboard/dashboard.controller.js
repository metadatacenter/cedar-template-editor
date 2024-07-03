'use strict';

define([
  'angular',
  'lib/angular-ui-tree/dist/angular-ui-tree'
], function (angular) {
  angular.module('cedar.templateEditor.dashboard.dashboardController', [])
      .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['$location', 'FrontendUrlService'];

  function DashboardController($location, FrontendUrlService) {
    var vm = this;
    const path = $location.path();
    if(path === '/'){
      const url = FrontendUrlService.getMyWorkspace();
      $location.url(url);
    }
  };

});
