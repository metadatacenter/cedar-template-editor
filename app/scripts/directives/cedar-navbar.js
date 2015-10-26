'use strict';

var cedarNavbar = function ($document) {

    function link(scope, element, attrs) {
        // Set #navbar var
        var navbar = $(attrs.target);
        $document.on('click', function () {
            // Check to see if navbar has been activated
            if (navbar.hasClass('in')) {
                // Collapse #navbar
                navbar.collapse('hide');
            }
        });
    }

    return {
        restrict: 'A',
        link: link
    };

};

cedarNavbar.$inject = ['$document'];
angularApp.directive('cedarNavbar', cedarNavbar);