'use strict';

var ViewCtrl = angularApp.controller('ViewCtrl', function ($rootScope, $scope, FormService, $routeParams, $location, $document) {

	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Runtime';

	// Giving $scope access to window.location for checking active state
	$scope.$location = $location;

	$scope.init = function() {
		// Enabling Bootstrap Popovers for help text button
		//angular.element('[data-toggle="popover"]').popover(); // Moved into field-directive.js

		$document.on('click', function(e) {
      // Check if Popovers exist and close on click anywhere but the popover toggle icon
      if( angular.element(e.target).data('toggle') !== 'popover' && angular.element('.popover').length ) {
      	angular.element('[data-toggle="popover"]').popover('hide');
      }
    });

    $scope.form = {};
		// read form with given id
		FormService.form($routeParams.id).then(function(form) {
			//console.log(form);
			$scope.form = form;
		});
	};

	$scope.init();
});
