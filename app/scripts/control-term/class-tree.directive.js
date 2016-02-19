'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.classTreeDirective', [])
    .directive('classTree', classTreeDirective);

  // TODO: refactor to cedarClassTree <cedar-class-tree>

  classTreeDirective.$inject = ['$timeout'];

  /**
   * This 'classTree' directive will call the 'childTree' directive for 
   * every child in the collection returned from the controlTermService.
   */
  function classTreeDirective($timeout) {
    return {
      restrict: 'E',
      scope: {
        tree: '=',
        term: '=',
        level: "=",
        selectedNode: "="
      },
      templateUrl: "scripts/control-term/class-tree.directive.html",
      replace: true,
      link: function(scope, element, attrs) {
        $timeout(function() {

          if (scope.selectedNode) {
            var id = scope.selectedNode["@id"];
            var node = angular.element("[at_id='" + id + "']");

            if (node.length > 0) {
              var $container = element.parent();
              var containerHeight = $container.height();
              var containerWidth = $container.width();
              var containerOffset = $container.offset();
              var selectedNodeOffset = node.offset();

              var topScrollAmount = selectedNodeOffset.top - containerOffset.top - containerHeight/2;
              var leftScrollAmount = selectedNodeOffset.left - containerOffset.left - containerWidth/2;

              if (topScrollAmount > 0) {
                $container.scrollTop(topScrollAmount);
              }

              if (leftScrollAmount > 0) {
                $container.scrollLeft(leftScrollAmount);
              }
            }
          }
        });
      }
    };
  };

});