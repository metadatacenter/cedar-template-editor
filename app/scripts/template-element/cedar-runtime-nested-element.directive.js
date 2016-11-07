'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarRuntimeNestedElementDirective', [])
      .directive('cedarRuntimeNestedElement', cedarRuntimeNestedElementDirective);

  cedarRuntimeNestedElementDirective.$inject = ["$rootScope", "$compile", 'DataUtilService', 'DataManipulationService'];

  function cedarRuntimeNestedElementDirective($rootScope, $compile, DataUtilService, DataManipulationService) {

    var directive = {
      template: '<div></div>',
      restrict: 'EA',
      scope   : {
        key           : "=",
        field         : '=',
        model         : '=',
        preview       : "=",
        removeChild   : '=',
        ngDisabled    : "=",
        renameChildKey: "=",
        isEditData    : "=",
        depth         : '=',
        path          : '='
      },
      replace : true,
      link    : linker
    };

    return directive;

    function linker(scope, element, attrs) {

      var nestElement = function () {

        setNested(scope.field);
        var template = '<div ng-if="$root.schemaOf(field)._ui.inputType" > <cedar-runtime-field field="field" model="model" delete="removeChild(field)" preview="false" rename-child-key="renameChildKey" is-edit-data="isEditData" path="path"></cedar-runtime-field></div><div ng-if="!$root.schemaOf(field)._ui.inputType" class="nested-element"><cedar-runtime-element key="key" model="model" element="field" preview="preview" delete="removeChild(field)" depth="depth" path="path"></cedar-runtime-element></div>';
        $compile(template)(scope, function (cloned, scope) {
          element.html(cloned);
        });
      };

      var getKey = function (node) {
        var key;
        if (node.items) {
          key = node.items["@id"];
        } else {
          key = node["@id"];
        }
        return key;
      };

      var getNestedValue = function (node) {
        var p = $rootScope.propertiesOf(node);
        p._tmp = p._tmp || {};
        return p._tmp.nested || false;
      };

      var setNestedValue = function (node, value, parentKey, depth) {
        var p = $rootScope.propertiesOf(node);
        p._tmp = p._tmp || {};
        p._tmp.nested = value;
      };

      var setNested = function (node) {
        var result = false;
        if (node) {
          var key = getKey(node);
          var rootKey = $rootScope.keyOfRootElement;
          var parentKey = getKey(scope.$parent.element);
          result = parentKey && key != rootKey && parentKey != rootKey;
          setNestedValue(node, result);
        }
        return result;
      };

      scope.lastIndex = function (path) {
        if (path) {
        var indices = path.split('-');
        return indices[indices.length - 1];
        }
      }


      scope.isMultiple = function () {
        return $rootScope.isArray(scope.model);
      };

      scope.nextChild = function (field, path) {

        var id = $rootScope.schemaOf(field)["@id"];
        var props = $rootScope.schemaOf(scope.$parent.element).properties;
        var order = $rootScope.schemaOf(scope.$parent.element)._ui.order;
        var selectedKey;
        var index = scope.lastIndex(path) || 0;
        var result = false;

        // find the field or element in the form's properties
        angular.forEach(props, function (value, key) {
          if ($rootScope.schemaOf(value)["@id"] == id) {
            selectedKey = key;
          }
        });

        if (selectedKey) {
          var idx = order.indexOf(selectedKey);
          idx += 1;
          if (idx < order.length) {
            var nextKey = order[idx];
            var next = props[nextKey];
            console.log('broadcast next sibling' + DataManipulationService.getId(next));
            $rootScope.$broadcast("setActive", [DataManipulationService.getId(next), index,  scope.path, true]);
            return;

          } else if (scope.isMultiple() && (index + 1 < scope.model.length)) {
            console.log('nextChild is next index ' + id);
            scope.setActive(index + 1, true);


          } else {
            console.log('broadcast nextChild up one level' + DataManipulationService.getId(scope.$parent.element));
            $rootScope.$broadcast("setActive", [DataManipulationService.getId(scope.$parent.element), index,  scope.$parent.path, true]);
            return;

          }
        }

        console.log('broadcast deselect ');
        $rootScope.$broadcast("setActive", [id, index,  path, false]);
      };

      if (scope.field) {
        nestElement();
      }

      scope.$watch("field", function () {
        if (scope.field && !getNestedValue(scope.field)) {
          nestElement();
        }
      });
    }

  };

});
