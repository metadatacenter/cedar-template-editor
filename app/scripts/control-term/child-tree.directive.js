'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.childTreeDirective', [])
    .directive('childTree', childTreeDirective);

  // TODO: refactor to cedarClassTree <cedar-class-tree>

  childTreeDirective.$inject = ['controlTermService', '$compile'];

  function childTreeDirective(controlTermService, $compile) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        subtree: '=',
        term: '=',
        level: "="
      },
      templateUrl: "scripts/control-term/child-tree.directive.html",
      link: function(scope, element, attrs) {
        // Recycle function to add nest children under parent element
        function nestChildren(children) {
          element.addClass('expanded loaded');

          var children = '<class-tree tree="' + children + '" term="term" level="' + (scope.level + 1) + '"></class-tree>';
          $compile(children)(scope, function(cloned, scope){
            element.append(cloned);
          });

        }

        if (scope.subtree) {
          var acronym = scope.subtree.links.ontology.slice(39);
          if (scope.subtree["@type"].indexOf("Ontology") >= 0) {
            scope.subtree.resultType = "Ontology";
          } else if (acronym != 'NLMVS') {
            scope.subtree.resultType = 'Ontology Class';
          } else {
            scope.subtree.resultType = "Value Set";
          }
        }

        // Default Class nested tree expansion from controlTermService.getClassTree() call
        if (scope.subtree && scope.subtree.children && scope.subtree.children.length) {
          nestChildren('subtree.children');
        }

        // Manual drilling down into Class children upon user interaction via controlTermService.getClassChildren() call
        element.find('a').on('click', function(event) {
          if (jQuery(this).parent().hasClass("expanded")) {
            jQuery(this).parent().removeClass("expanded");
          } else if (jQuery(this).parent().hasClass("loaded")){
            jQuery(this).parent().addClass("expanded");
          } else {
            if (scope.subtree.hasChildren !== false && !scope.children) {
              BioPortalService.getClassChildren(scope.subtree.links.ontology.slice(39), scope.subtree['@id']).then(function(response) {
                if (!response || response.length == 0) {
                  scope.subtree.hasChildren = false;
                }
                scope.children = response;
                nestChildren('children');
              });
            }
          }
        });
      }
    };
  };
});
