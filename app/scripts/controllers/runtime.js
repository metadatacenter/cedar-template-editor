'use strict';

var ViewCtrl = angularApp.controller('RuntimeController', function ($rootScope, $scope, FormService, $routeParams, $document) {

	// set Page Title variable when this controller is active
	$rootScope.pageTitle = 'Template Runtime';

	$scope.init = function() {
		// Enabling Bootstrap Popovers for help text button
		angular.element('[data-toggle="popover"]').popover();

		$document.on('click', function(e) {
      // Check if Popovers exist and close on click anywhere but the popover toggle icon
      if( angular.element(e.target).data('toggle') !== 'popover' && angular.element('.popover').length ) {
      	angular.element('[data-toggle="popover"]').popover('hide');
      }
    });
	};

	$scope.init();
});
