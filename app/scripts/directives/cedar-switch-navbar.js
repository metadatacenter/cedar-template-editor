'use strict';

var cedarSwitchNavbar = function ($window, HeaderService) {

  function link(scope, element, attrs) {

    var navbarMini = angular.element("#navbarMini");
    var w = angular.element($window);

    var switchNavbar = function () {
      if (HeaderService.showMini($window.pageYOffset)) {
        navbarMini.show().removeClass('navbarMiniHide').addClass('navbarMiniShow');
      } else {
        navbarMini.hide().removeClass('navbarMiniShow').addClass('navbarMiniHide');
      }
    }

    w.bind('scroll', switchNavbar);

    scope.$on('$destroy', function () {
      w.off('scroll', switchNavbar);
    });
  }

  return {
    restrict: 'A',
    scope: {},
    link: link
  };
};

cedarSwitchNavbar.$inject = ["$window", "HeaderService"];
angularApp.directive('cedarSwitchNavbar', cedarSwitchNavbar);