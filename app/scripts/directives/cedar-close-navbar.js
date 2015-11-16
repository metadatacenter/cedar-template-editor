'use strict';

var cedarCloseNavbar = function ($document) {

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

cedarCloseNavbar.$inject = ['$document'];
angularApp.directive('cedarCloseNavbar', cedarCloseNavbar);