'use strict';

angularApp.directive('cedarNavbar', function ($document) {
  // Set #navbar var
  var navbar = $('#navbar');

  function link(scope, element, attrs) {
    
    $document.on('click', function() {
      // Check to see if navbar has been activated
      if(navbar.hasClass('in')) {
        // Collapse #navbar
        navbar.collapse('hide');
      }
    });
  }

  return {
    link: link
  };

});
