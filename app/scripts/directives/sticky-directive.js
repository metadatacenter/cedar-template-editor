'use strict';

var stickyDirective = function ($window, $document, $rootScope, $timeout, HeaderService, HEADER_MINI) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {

            function makeSticky() {
                var initialOffset = element.offset().top;
                angular.element($window).bind('scroll', function () {
//return;
                    if ($window.innerWidth >= 768 && ($window.pageYOffset > HeaderService.getScrollLimit() + HEADER_MINI.stickyThreshold )) {
                        element.addClass('sticky');
                        element.width(element.parent().width());
                    } else {
                        element.removeClass('sticky');
                    }

                });
            }

            function resizeWidth() {
                element.width(element.parent().width());
            }

            $timeout(makeSticky);

            if ($window.innerWidth >= 768) {
                angular.element($window).bind('resize', function () {
                    resizeWidth();
                });
            }
        }
    };
};

stickyDirective.$inject = ["$window", "$document", "$rootScope", "$timeout", "HeaderService", "HEADER_MINI"];
angularApp.directive('stickyDirective', stickyDirective);