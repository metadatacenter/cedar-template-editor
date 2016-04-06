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

      //var nested;

      var nestElement = function () {
        setNested(scope.field);
        var template = '<div ng-if="$root.propertiesOf(field)._ui.inputType" ng-class="{&quot;field-instance&quot;:true, &quot;multiple-instance-field&quot;:$root.isArray(model)}"> <field-directive field="field" model="model" delete="removeChild(field)" preview="preview" rename-child-key="renameChildKey" ></field-directive></div><div ng-if="!$root.propertiesOf(field)._ui.inputType && model !== undefined" class="nested-element"><cedar-template-element key="key" model="model" element="field" preview="preview" delete="removeChild(field)" ></cedar-template-element></div>';
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
        var key = getKey(node);
        var rootKey = $rootScope.keyOfRootElement;
        var parentKey = getKey(scope.$parent.element);
        var result = parentKey && key != rootKey && parentKey != rootKey;

        //console.log('setNested ' + key + ' ' + rootKey + ' ' +  parentKey + ' ' +  result);

        setNestedValue(node, result);
        return result;
      };

      if (scope.field) {
        nestElement();
      }

      scope.$watch("field", function() {
        if (scope.field && !getNestedValue(scope.field)) {
          nestElement();
        }
      });
    }

  };

});
