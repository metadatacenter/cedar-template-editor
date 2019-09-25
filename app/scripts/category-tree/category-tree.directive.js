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
        '<a ng-click="helper.open(child)" href="javascript:void(0);">',
        '<span ng-if="helper.isCollapsed(child)"><i class="fa fa-caret-right"></i><i class="fa fa-folder-o"></i></span>',
        '<span ng-if="helper.isExpanded(child)"><i class="fa fa-caret-down"></i><i class="fa fa-folder-open-o"></i></span>',
        '<span ng-if="helper.isLeaf(child)"><i class="fa fa-caret-right" style="color: transparent;"></i><i class="fa fa-file-o"></i></span>',
        '</a>',
        '<a ng-click="helper.searchCategory(child, callback)" href="javascript:void(0);">',
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
