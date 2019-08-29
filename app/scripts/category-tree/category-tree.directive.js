'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.categoryTree.categoryTreeDirective', [])
      .directive('categoryTree', categoryTreeDirective);


  categoryTreeDirective.$inject = [];

  function categoryTreeDirective() {

    return {
      scope: {
        helper: '=',
        category: '='
      },
      restrict: 'E',
      template: [
        '<ol class="category-list-group">',
        '<li ng-repeat="child in category.children" class="category-list-group-item">',
        '<category-tree-node child="child">',
        '<a ng-click="helper.open(child)" href="javascript:void(0);">',
        '<img ng-if="helper.isCollapsed(child)" src="/img/closed-folder-icon-16.png">',
        '<img ng-if="helper.isExpanded(child)" src="/img/open-folder-icon-16.png">',
        '<img ng-if="helper.isLeaf(child)" src="/img/open-folder-with-content-icon-16.png">',
        '&nbsp;{{ child["schema:name"] }}',
        '</a>',
        '</category-tree-node>',
        '</li>',
        '</ol>'
      ].join("")
    };

  }

})
;
