'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.categoryTree.categoryTreeNodeDirective', [])
      .directive('categoryTreeNode', categoryTreeNodeDirective);


  categoryTreeNodeDirective.$inject = ['$interpolate', '$compile'];

  function categoryTreeNodeDirective($interpolate, $compile) {

    return {
      scope   : {
        child: '='
      },
      restrict: 'E',

      link: function (scope, element) {
        var treeNode = {
          init: function () {
            // Init any vars
            scope.$watch('child.isExpanded', this.toggle.bind(this));
          },

          expand: function () {
            this.domId = 'document-children-' + Math.floor(Math.random() * 10000);//scope.child['@id'];

            // Insert child documents
            var template = '<category-tree id="{{ childrenId }}" category="child" helper="helper"></category-tree>';
            var html = $interpolate(template)({childrenId: this.domId});
            var childrenElement = $compile(html)(scope);

            // Insert compiled template
            element.append(childrenElement);
          },

          collapse: function () {
            // Remove child elements, if needed
            $('#' + this.domId).remove();
          },

          toggle: function (shouldExpand) {
            if (shouldExpand) {
              this.expand();
            } else {
              this.collapse();
            }
          }
        };

        // Init
        treeNode.init();
      }
    };

  }

})
;
