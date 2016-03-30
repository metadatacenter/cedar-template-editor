'use strict';

define([
  'angular'
], function(angular) {
  angular.module('cedar.templateEditor.templateElement.cedarNestedTemplateElementDirective', [])
    .directive('cedarNestedTemplateElement', cedarNestedTemplateElementDirective);

  cedarNestedTemplateElementDirective.$inject = ["$rootScope", "$compile"];

  function cedarNestedTemplateElementDirective($rootScope, $compile) {

    var directive = {
      template: '<div></div>',
      restrict: 'EA',
      scope: {
        key: "=",
        field: '=',
        model: '=',
        preview: "=",
        removeChild: '=',
        ngDisabled: "=",
        renameChildKey: "="
      },
      replace: true,
      link: linker
    };

    return directive;

    function linker(scope, element, attrs) {
      var nestElement = function() {
        var template = '<div ng-if="$root.propertiesOf(field)._ui.inputType" ng-class="{&quot;field-instance&quot;:true, &quot;multiple-instance-field&quot;:$root.isArray(model)}"> <field-directive field="field" model="model" delete="removeChild(field)" preview="preview" rename-child-key="renameChildKey"></field-directive></div><div ng-if="!$root.propertiesOf(field)._ui.inputType && model !== undefined" class="nested-element"><cedar-template-element key="key" model="model" element="field" preview="preview" delete="removeChild(field)"></cedar-template-element></div>';
        $compile(template)(scope, function(cloned, scope){
  		  element.html(cloned);
  		});
      }

      var nested;
      if (scope.field) {
        nestElement();
        nested = true;
      } else {
        nested = false;
      }

      scope.$watch("field", function() {
        if (scope.field && !nested) {
          nestElement();
          nested = true;
        }
      });
    }

  };

});
