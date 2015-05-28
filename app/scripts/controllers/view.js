'use strict';

angularApp.controller('ViewCtrl', function ($rootScope, $scope, FormService, $routeParams, $location, $document) {

	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Runtime';

	// Giving $scope access to window.location for checking active state
	$scope.$location = $location;

  $scope.form = {};
	// read form with given id
	FormService.form($routeParams.id).then(function(form) {
		//console.log(form);
		$scope.form = form;
	});
});
