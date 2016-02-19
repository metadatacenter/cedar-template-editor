'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.layout.switchNavbarDirective', [])
    .directive('cedarSwitchNavbar', cedarSwitchNavbar);

  cedarSwitchNavbar.$inject = ["$window", "HeaderService"];

  function cedarSwitchNavbar($window, HeaderService) {

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

});
