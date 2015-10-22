'use strict';

angularApp.directive('scrollableDirective', function ($window, $document, $rootScope, $timeout) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
            angular.element($window).bind('scroll', function () {
                if ($window.pageYOffset > $rootScope.headerMiniLimit) {
                    angular.element("#navbarMini").show().removeClass('navbarMiniHide').addClass('navbarMiniShow');
                } else {
                    angular.element("#navbarMini").hide().removeClass('navbarMiniShow').addClass('navbarMiniHide');
                }
            });
        }
    };
});