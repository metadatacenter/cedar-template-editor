'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.layout.closeNavbarDirective', [])
    .directive('cedarCloseNavbar', cedarCloseNavbar);

  cedarCloseNavbar.$inject = ['$document'];
  
  function cedarCloseNavbar($document) {

    function link(scope, element, attrs) {

      var navbar = $(scope.target);

      var documentClick = function () {
        // Check to see if navbar has been activated
        if (navbar.hasClass('in')) {
          // Collapse #navbar
          navbar.collapse('hide');
        }
      };

      $document.on('click', documentClick);

      scope.$on('$destroy', function () {
        $document.off('click', documentClick);
      });
    }

    return {
      restrict: 'A',
      scope: {
        "target": "@"
      },
      link: link
    };

  };

});
