'use strict';

angularApp.directive('stickyDirective', function ($window, $document, $rootScope, $timeout) {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope, element, attrs) {

    	function makeSticky() {
    		var initialOffset = element.offset().top;
				angular.element($window).bind('scroll', function() {

					if ($window.innerWidth >= 768 &&  ($window.pageYOffset > initialOffset)) {
			    	element.addClass('sticky');
			    	element.width(element.parent().width());
					} else {
						element.removeClass('sticky');
					}

					if ($window.pageYOffset > 140) {
						angular.element("#navbarMini").show().removeClass('navbarMiniHide').addClass('navbarMiniShow');
					} else {
						angular.element("#navbarMini").hide().removeClass('navbarMiniShow').addClass('navbarMiniHide');
					}


				});
    	}

			function resizeWidth() {
				element.width(element.parent().width());
			}

			$timeout(makeSticky);

			if ($window.innerWidth >= 768) {
				angular.element($window).bind('resize', function() {
					resizeWidth();
				});
			}
    }
  };
});