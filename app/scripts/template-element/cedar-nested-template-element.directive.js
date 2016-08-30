'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.templateElement.cedarNestedTemplateElementDirective', [])
      .directive('cedarNestedTemplateElement', cedarNestedTemplateElementDirective);

  cedarNestedTemplateElementDirective.$inject = ["$rootScope", "$compile", 'DataUtilService'];

  function cedarNestedTemplateElementDirective($rootScope, $compile, DataUtilService) {

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
        renameChildKey: "="
      },
      replace : true,
      link    : linker
    };

    return directive;

    function linker(scope, element, attrs) {

      var nestElement = function () {

        setNested(scope.field);
        var template = '<div ng-if="$root.schemaOf(field)._ui.inputType" > <field-directive field="field" model="model" delete="removeChild(field)" preview="false" rename-child-key="renameChildKey" ></field-directive></div><div ng-if="!$root.schemaOf(field)._ui.inputType" class="nested-element"><cedar-template-element key="key" model="model" element="field" preview="preview" delete="removeChild(field)" ></cedar-template-element></div>';
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

      var setNestedValue = function (node, value) {
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
