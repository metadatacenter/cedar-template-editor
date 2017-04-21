'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.cedarChildTreeDirective', [])
      .directive('cedarChildTree', cedarChildTreeDirective);

  cedarChildTreeDirective.$inject = ['controlledTermService', 'controlledTermDataService', '$compile'];

  function cedarChildTreeDirective(controlledTermService, controlledTermDataService, $compile) {

    var directive = {
      restrict   : 'E',
      replace    : true,
      scope      : {
        getClassDetailsCallback: '=',  // why won't this work with & ?
        level                  : '=',
        subtree                : '=',
        isSelectedCallback     : '=',  // why won't this work with & ?
        isPropertyTree         : '='
      },
      templateUrl: 'scripts/controlled-term/cedar-child-tree.directive.html',
      link       : linker
    };

    return directive;

    cedarChildTreeController.$inject = ['$rootScope', '$scope', 'controlledTermDataService'];

    function linker(scope, element, attrs) {

      // Recycle function to add nest children under parent element
      function nestChildren(children) {
        element.addClass('expanded');
        element.addClass('loaded');

        var children = '<cedar-class-tree tree="' + children + '" term="term" level="' + (scope.level + 1) + '" is-selected-callback="isSelectedCallback" get-class-details-callback="getClassDetailsCallback"></cedar-class-tree>';
        $compile(children)(scope, function (cloned, scope) {
          element.append(cloned);
        });
      }

      // Default Class nested tree expansion from controlledTermDataService.getClassTree() call
      if (scope.subtree && scope.subtree.children && scope.subtree.children.length) {
        nestChildren('subtree.children');
      }

      // Manual drilling down into Class children upon user interaction via controlledTermDataService.getClassChildren() call
      element.find('a').on('click', function (event) {

        if (jQuery(this).parent().hasClass("expanded")) {
          jQuery(this).parent().removeClass("expanded");
          jQuery(this).parent().children('ul').hide();
        } else if (jQuery(this).parent().hasClass("loaded")) {
          jQuery(this).parent().addClass("expanded");
          jQuery(this).parent().children('ul').show();
        } else {
          if (scope.subtree.hasChildren !== false && !scope.children) {
            var acronym = controlledTermService.getAcronym(scope.subtree);
            var classId = scope.subtree['@id'];
            if (!scope.isPropertyTree) {
              controlledTermDataService.getClassChildren(acronym, classId).then(function (response) {
                if (!response || response.length == 0) {
                  scope.subtree.hasChildren = false;
                }
                scope.children = response;
                nestChildren('children');
              });
            }
            else { // is property tree
              controlledTermDataService.getPropertyChildren(acronym, classId).then(function (response) {
                if (!response || response.length == 0) {
                  scope.subtree.hasChildren = false;
                }
                scope.children = response;
                nestChildren('children');
              });
            }
          }
        }
      });
    };

  };
});
