'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.controlledTerm.relationTypeSelectorDirective', [])
      .directive('relationTypeSelector', relationTypeSelector);

  relationTypeSelector.$inject = [];

  /**
   * a selector dropdown for relation types
   */
  function relationTypeSelector() {

    return {
      restrict: 'E',
      scope   : {
        selectedRelationType: '='
      },
      templateUrl : 'scripts/controlled-term/relation-type-selector.directive.html',
      link    : function ($scope, $element, attrs) {

        $scope.relationTypes = [
          { id: 'http://www.w3.org/2004/02/skos/core#closeMatch', label: 'close match' },
          { id: 'http://www.w3.org/2004/02/skos/core#exactMatch', label: 'exact match' },
          { id: 'http://www.w3.org/2004/02/skos/core#broadMatch', label: 'broad match' },
          { id: 'http://www.w3.org/2004/02/skos/core#narrowMatch', label: 'narrow match' },
          { id: 'http://www.w3.org/2004/02/skos/core#relatedMatch', label: 'related match' },
          { id: 'http://www.w3.org/2000/01/rdf-schema#subclassOf', label: 'subclass of' }
        ];

        $scope.isOpen = false;

        $scope.update = function (value) {
          $scope.selectedRelationType = value;
          $scope.isOpen = false;
        };

        $scope.getDropdownLabel = function() {
          if ($scope.selectedRelationType == null) {
            return 'Select a relationship type';
          }
          else {
            return $scope.selectedRelationType.label;
          }
        }

      }
    }
  }
});
