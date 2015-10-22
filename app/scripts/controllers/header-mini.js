'use strict';

angularApp.controller('HeaderCtrlMini', function ($scope, HeaderService) {
  $scope.dataContainer = HeaderService.dataContainer;
});
