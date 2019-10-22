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
        category: '=',
        callback: '='
      },
      restrict: 'E',
      template: [
        '<ol class="category-list-group">',
        '<li ng-repeat="child in category.children" class="category-list-group-item">',
        '<category-tree-node child="child" callback="callback">',
        '<div class="category-link-wrapper">',
        '<div class="category-open-link">',
        '<a ng-click="helper.open(child)" href="javascript:void(0);">',
        '<span ng-if="helper.isCollapsed(child)"><i class="fa fa-caret-right"></i></span>',
        '<span ng-if="helper.isExpanded(child)"><i class="fa fa-caret-down"></i></span>',
        '<span ng-if="helper.isLeaf(child)"><i class="fa fa-dot-circle-o"></i></span>',
        '</a>',
        '</div>',
        '<div class="category-search-link">',
        '<a ng-click="helper.searchCategory(child, callback)" href="javascript:void(0);">',
        '{{ child["schema:name"] }}',
        '</a>',
        '</div>',
        '</div>',
        '</category-tree-node>',
        '</li>',
        '</ol>'
      ].join("")
    };

  }

})
;
