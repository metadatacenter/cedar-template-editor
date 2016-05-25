'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.simpleDirective', [])
      .directive('simple', simpleDirective);

  simpleDirective.$inject = ['$parse','$timeout'];

  /**
   * Hides an image if the image src does not load.
   */
  function simpleDirective($parse,$timeout) {
    console.log('form/simpleDirective');

    var alert = function (message) {
      console.log(message);
    };

    var toggleDropDown = function(id) {
      var selectId = '#select' + id;
      var buttonId = '#button' + id;

      console.log('click ' + '#select' + id );
      jQuery(selectId).click();


      $timeout(function () {
        console.log('toggleDropDown ' + buttonId );
        jQuery(buttonId).dropdown('toggle');
      });

      return false;
    };



    return {
      restrict: 'A',
      link    : function (scope, element, attr) {
      console.log('link');

        scope.getId = function(resource) {
          var id = resource['@id'];
          return 'id' + id.substr(id.lastIndexOf('/') + 1);
        };

        var fn = $parse(attr.simpleClick);
        element.bind('contextmenu', function($event) {
          scope.$apply(function() {
            event.preventDefault();
            console.log('right click');

            toggleDropDown(attr.dropdownid);
            fn(scope, {$event:event});

          });
        });

        scope.alert = function (message) {
          console.log('simple' +message);
        };


      }
    };
  };

});