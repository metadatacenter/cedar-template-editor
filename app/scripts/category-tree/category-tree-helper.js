'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.categoryTree.categoryTreeHelper', [])
      .factory('categoryTreeHelper', categoryTreeHelper);

  categoryTreeHelper.$inject = ['resourceService'];

  function categoryTreeHelper(resourceService) {

    var service = {};

    service.open = function (child) {
      if (child.children) {
        service.toggle(child);
      }
    };

    service.searchCategory = function (child, callback) {
      callback(child['@id']);
    };

    service.toggle = function (folder) {
      if (folder.isExpanded) {
        service.collapse(folder);
      } else {
        service.expand(folder);
      }
    };

    service.expand = function (folder) {
      if (folder.children && folder.children.length > 0) {
        folder.isExpanded = true;
        return folder.children;
      }
    };

    service.collapse = function (folder) {
      if (folder.children && folder.children.length > 0) {
        folder.isExpanded = false;
      }
    };

    service.isExpanded = function (child) {
      return child.isExpanded && child.children.length > 0;
    };

    service.isCollapsed = function (child) {
      return !child.isExpanded && child.children.length > 0;
    };

    service.isLeaf = function (child) {
      return child.children.length == 0;
    };

    return service;
  }

});
