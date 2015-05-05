'use strict';

var ViewCtrl = angularApp.controller('ViewCtrl', function ($rootScope, $scope, FormService, $routeParams) {

	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Runtime';

    $scope.form = {};
	// read form with given id
	FormService.form($routeParams.id).then(function(form) {
		$scope.form = form;
	});
});
