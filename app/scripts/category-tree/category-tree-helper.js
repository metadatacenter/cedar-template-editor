'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.categoryTree.categoryTreeHelper', [])
      .factory('CategoryTreeHelper', function () {

        function CategoryTreeHelper() {
        }

        // Define prototype methods
        angular.extend(CategoryTreeHelper.prototype, {

          open: function (child) {
            console.log("Clicked open");
            if (child.children) {
              this.toggle(child);
            } else {
              this.navigateTo(child);
            }
          },

          toggle: function (folder) {
            if (folder.isExpanded) {
              this.collapse(folder);
            } else {
              this.expand(folder);
            }
          },

          expand: function (folder) {
            if (folder.children && folder.children.length > 0) {
              folder.isExpanded = true;
              return folder.children;
            }
          },

          collapse: function (folder) {
            if (folder.children && folder.children.length > 0) {
              folder.isExpanded = false;
            }
          },

          isExpanded(child) {
            return child.isExpanded && child.children.length > 0;
          },

          isCollapsed(child) {
            return !child.isExpanded && child.children.length > 0;
          },

          isLeaf(child) {
            return child.children.length == 0;
          },

          navigateTo: function (file) {
            window.alert('Open category');
          }
        });

        return CategoryTreeHelper;
      })

});
