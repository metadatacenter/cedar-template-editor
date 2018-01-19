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
        parentElement : '=',
        delete   : '=',
        ngDisabled    : "=",
        renameChildKey: "=",
        isEditData:     "=",

      },
      replace : true,
      link    : linker
    };

    return directive;

    function linker(scope, element, attrs) {


      scope.directiveName = 'cedarNestedTemplateElement';

      scope.nestElement = function () {

        var getId = function (node) {
          var id;
          if (node.items) {
            id = node.items["@id"];
          } else {
            id = node["@id"];
          }
          return id;
        };

        var getNested = function (node) {
          var result = false;
          if (node) {
            var nodeId = getId(node);
            var rootId = $rootScope.keyOfRootElement;
            var parentId = getId(scope.$parent.element);
            result = parentId && nodeId != rootId && parentId != rootId;
          }
          return result;
        };

        var template;
        if (getNested(scope.field)) {
          template = '<div ng-if="$root.schemaOf(field)._ui.inputType" > <field-directive parent-element="parentElement"  delete="delete" nested="true" field-key="key" field="field" model="model"  preview="false" rename-child-key="renameChildKey" is-edit-data="isEditData" ></field-directive></div><div ng-if="!$root.schemaOf(field)._ui.inputType" ><cedar-template-element delete="delete" parent-element="parentElement" nested="true"  key="key" model="model" element="field" ></cedar-template-element></div>';
        } else {
          template = '<div ng-if="$root.schemaOf(field)._ui.inputType" > <field-directive parent-element="parentElement"  delete="delete" nested="false" field-key="key" field="field" model="model"  preview="false" rename-child-key="renameChildKey" is-edit-data="isEditData" ></field-directive></div><div ng-if="!$root.schemaOf(field)._ui.inputType" ><cedar-template-element delete="delete" parent-element="parentElement"  nested="false" key="key" model="model" element="field" ></cedar-template-element></div>';
        }
        $compile(template)(scope, function (cloned, scope) {
          element.html(cloned);
        });
      };

      if (scope.field) {
        scope.nestElement();
      }

      scope.$watch("field", function () {
        if (scope.field) {
          scope.nestElement();
        }
      });
    }
  };
});
