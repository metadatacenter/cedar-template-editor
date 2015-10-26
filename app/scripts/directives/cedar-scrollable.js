'use strict';

var cedarScrollable = function ($window, $document, $rootScope, $timeout, HeaderService) {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope, element, attrs) {
      angular.element($window).bind('scroll', function () {
        if (HeaderService.showMini($window.pageYOffset)) {
          angular.element("#navbarMini").show().removeClass('navbarMiniHide').addClass('navbarMiniShow');
        } else {
          angular.element("#navbarMini").hide().removeClass('navbarMiniShow').addClass('navbarMiniHide');
        }
      });
    }
  };
};

cedarScrollable.$inject = ["$window", "$document", "$rootScope", "$timeout", "HeaderService"];
angularApp.directive('cedarScrollable', cedarScrollable);