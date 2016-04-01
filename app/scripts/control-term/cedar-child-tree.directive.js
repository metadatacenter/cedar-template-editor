'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.controlTerm.cedarChildTreeDirective', [])
    .directive('cedarChildTree', cedarChildTreeDirective);

  cedarChildTreeDirective.$inject = ['controlTermService', 'controlTermDataService', '$compile'];

  function cedarChildTreeDirective(controlTermService, controlTermDataService, $compile) {

    var directive = {
      restrict: 'E',
      replace: true,
      scope: {
        getClassDetailsCallback: '=',  // why won't this work with & ?
        level: '=',
        subtree: '=',
        isSelectedCallback: '='  // why won't this work with & ?
      },
      templateUrl: 'scripts/control-term/cedar-child-tree.directive.html',
      link: linker
    };

    return directive;

    cedarChildTreeController.$inject = ['$rootScope', '$scope', 'controlTermDataService'];
    
    function linker(scope, element, attrs) {

      // Recycle function to add nest children under parent element
      function nestChildren(children) {
        element.addClass('expanded loaded');

        var children = '<cedar-class-tree tree="' + children + '" term="term" level="' + (scope.level + 1) + '" is-selected-callback="isSelectedCallback" get-class-details-callback="getClassDetailsCallback"></cedar-class-tree>';
        $compile(children)(scope, function(cloned, scope){
          element.append(cloned);
        });
      }
      
      if (scope.subtree) {
        //console.log("SUBTREE");
        //console.log(scope.subtree);
        //var acronym = scope.subtree.ontology.substr(scope.subtree.ontology.lastIndexOf('/') + 1);
        //scope.subtree.type = scope.subtree.type;
        //if (scope.subtree["@type"].indexOf("Ontology") >= 0) {
        //  scope.subtree.resultType = "Ontology";
        //} else if (acronym != 'NLMVS' && acronym != 'CEDARVS') {
        //  scope.subtree.resultType = 'Ontology Class';
        //} else {
        //  scope.subtree.resultType = "Value Set";
        //}
      }

      // Default Class nested tree expansion from controlTermDataService.getClassTree() call
      if (scope.subtree && scope.subtree.children && scope.subtree.children.length) {
        nestChildren('subtree.children');
      }

      // Manual drilling down into Class children upon user interaction via controlTermDataService.getClassChildren() call
      element.find('a').on('click', function(event) {
        if (jQuery(this).parent().hasClass("expanded")) {
          jQuery(this).parent().removeClass("expanded");
        } else if (jQuery(this).parent().hasClass("loaded")){
          jQuery(this).parent().addClass("expanded");
        } else {
          if (scope.subtree.hasChildren !== false && !scope.children) {
            var acronym = controlTermService.getAcronym(scope.subtree);
            var classId = scope.subtree['@id'];
            controlTermDataService.getClassChildren(acronym, classId).then(function(response) {
              console.log("Call to getClassChildren");
              if (!response || response.length == 0) {
                scope.subtree.hasChildren = false;
              }
              scope.children = response;
              nestChildren('children');
            });
          }
        }
      });
    };

  };
});
