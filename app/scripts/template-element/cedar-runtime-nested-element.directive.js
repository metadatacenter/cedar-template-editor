'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarRuntimeNestedElementDirective', [])
      .directive('cedarRuntimeNestedElement', cedarRuntimeNestedElementDirective);

  cedarRuntimeNestedElementDirective.$inject = ["$rootScope", "$compile", 'DataUtilService'];

  function cedarRuntimeNestedElementDirective($rootScope, $compile, DataUtilService) {

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
        isEditData:     "=",
        depth: '='
      },
      replace : true,
      link    : linker
    };

    return directive;

    function linker(scope, element, attrs) {

      var nestElement = function () {

        setNested(scope.field);
        var template = '<div ng-if="$root.schemaOf(field)._ui.inputType" > <cedar-runtime-field field="field" model="model" delete="removeChild(field)" preview="false" rename-child-key="renameChildKey" is-edit-data="isEditData" ></cedar-runtime-field></div><div ng-if="!$root.schemaOf(field)._ui.inputType" class="nested-element"><cedar-runtime-element key="key" model="model" element="field" preview="preview" delete="removeChild(field)" depth="depth"></cedar-runtime-element></div>';
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

      scope.nextChild = function (field) {


        var id = $rootScope.schemaOf(field)["@id"];
        var selectedKey;
        var props = scope.$parent.element.properties;
        console.log('nextChild' + id);
        console.log(props);

        // find the field or element in the form's properties
        angular.forEach(props, function (value, key) {
          if ($rootScope.schemaOf(value)["@id"] == id) {
            selectedKey = key;
          }
        });

        if (selectedKey) {

          // and the order array
          var order = $rootScope.schemaOf(scope.$parent.element)._ui.order;
          var idx = order.indexOf(selectedKey);

          idx += 1;
          if (idx < order.length) {
            var nextKey = order[idx];
            console.log(props[nextKey]);
            return props[nextKey];
          } else {
            console.log('go up one level');
            var parentId = $rootScope.schemaOf(scope.$parent.element)['@id'];
            console.log('broadcast setActive for ' + parentId);
            $rootScope.$broadcast("setActive", [parentId]);
          }
        }
        return null;
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
