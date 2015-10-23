'use strict';

var scrollableDirective = function ($window, $document, $rootScope, $timeout, HeaderService) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
            angular.element($window).bind('scroll', function () {
                if ($window.pageYOffset > $rootScope.headerMiniLimit && HeaderService.isEnabled()) {
                    angular.element("#navbarMini").show().removeClass('navbarMiniHide').addClass('navbarMiniShow');
                } else {
                    angular.element("#navbarMini").hide().removeClass('navbarMiniShow').addClass('navbarMiniHide');
                }
            });
        }
    };
};

scrollableDirective.$inject = ["$window", "$document", "$rootScope", "$timeout", "HeaderService"];
angularApp.directive('scrollableDirective', scrollableDirective);