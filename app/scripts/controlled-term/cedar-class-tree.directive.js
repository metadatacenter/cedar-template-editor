'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.cedarClassTreeDirective', [])
      .directive('cedarClassTree', cedarClassTreeDirective);

  cedarClassTreeDirective.$inject = ['$timeout'];

  /**
   * This 'cedarClassTree' directive will call the 'childTree' directive for
   * every child in the collection returned from the controlledTermDataService.
   */
  function cedarClassTreeDirective($timeout) {
    var directive = {
      restrict   : 'E',
      scope      : {
        tree                   : '=',
        term                   : '=',
        level                  : '=',
        selectedNode           : '=',
        isSelectedCallback     : '=',  // why won't this work with & ?
        getClassDetailsCallback: '=', // why won't this work with & ?
      },
      templateUrl: 'scripts/controlled-term/cedar-class-tree.directive.html',
      replace    : true,
      link       : linker
    };

    return directive;

    function linker(scope, element, attrs) {
      var node = null;
      scope.treeContainer = element.parent();

      $timeout(function () {

        if (scope.selectedNode) {
          var id = scope.selectedNode["@id"];
          node = angular.element("[at_id='" + id + "']");
          if (node.length > 0) {
            var $container = element.parent();
            var topScrollAmount = node.offset().top - $container.offset().top - $container.height() / 4;
            if (topScrollAmount > 0) {
              $container.animate({
                scrollTop: topScrollAmount
              }, 500);
            }
          }
        }

      });
    }
  }

});