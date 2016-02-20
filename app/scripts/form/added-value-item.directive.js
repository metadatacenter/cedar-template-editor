'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.form.addedValueItemDirective', [])
    .directive('addedValueItem', addedValueItemDirective);

  addedValueItemDirective.$inject = [];

  function addedValueItemDirective() {
    return {
      restrict: 'E',
      scope: {
        term: '=',
        itemData: '='
      },
      template: '<li id="added-item-{{itemData.prefLabel}}" class="added-item"><span class="col-1">{{itemData.prefLabel}}</span><span class="col-2">{{itemData.ontologyDescription}}</span><span class="col-3"><div class="item item-edit" ng-click="term.editValueAddedItem(itemData)"><i class="fa fa-pencil"></i></div><div class="item item-delete" ng-click="term.deleteValueAddedItem(itemData)"><i class="fa fa-close"></i></div></span></li>',
      replace: true
    };
  };
  
});
