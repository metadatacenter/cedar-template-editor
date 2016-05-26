'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.rightClickDirective', [])
      .directive('rightclick', rightClickDirective);

  rightClickDirective.$inject = ['$parse','$timeout'];

  /**
   * Hides an image if the image src does not load.
   */
  function rightClickDirective($parse,$timeout) {

    var selectAndToggleMenu = function(id) {
      var selectId = '#select' + id;
      var buttonId = '#button' + id;

      $timeout(function () {
        jQuery(selectId).click();
        jQuery(buttonId).dropdown('toggle');
      });

      return false;
    };

    return {
      restrict: 'A',
      link    : function (scope, element, attr) {

        scope.getId = function(resource) {
          var id = resource['@id'];
          return 'id' + id.substr(id.lastIndexOf('/') + 1);
        };

        //var fn = $parse(attr.simpleClick);
        element.bind('contextmenu', function($event) {
          scope.$apply(function() {
            event.preventDefault();
            selectAndToggleMenu(attr.dropdownid);
            //fn(scope, {$event:event});
          });
        });

      }
    };
  };

});