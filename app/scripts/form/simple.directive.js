'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.simpleDirective', [])
      .directive('simple', simpleDirective);

  simpleDirective.$inject = ['$parse'];

  /**
   * Hides an image if the image src does not load.
   */
  function simpleDirective($parse) {
    console.log('form/simpleDirective');

    var alert = function (message) {
      console.log(message);
    };

    return {
      restrict: 'A',
      link    : function (scope, element, attr) {
      console.log('link');




        var fn = $parse(attr.simpleClick);
        element.bind('contextmenu', function($event) {
          scope.$apply(function() {
            event.preventDefault();
            console.log('right click');
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