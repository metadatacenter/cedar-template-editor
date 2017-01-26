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
      };

      scope.isMultiple = function () {
        return $rootScope.isArray(scope.model);
      };

      scope.getId = function () {
        return $rootScope.schemaOf(scope.field)['@id'];
      };


      scope.nextChild = function (field, index, path) {

        var next = DataManipulationService.nextSibling(field, scope.$parent.element);
        var parentIndex = parseInt(scope.lastIndex(path)) || 0;
        var parentPath = path.substring(0, path.lastIndexOf('-'));
        if (next) {

          // field's next sibling
          $rootScope.$broadcast("setActive", [DataManipulationService.getId(next), index, scope.path, true]);
          return;
        }

        if (scope.$parent.isMultiple() && (parentIndex + 1 < scope.$parent.model.length)) {

          // next parent index if multiple
          $rootScope.$broadcast("setActive",
              [DataManipulationService.getId(scope.$parent.element), parentIndex + 1, scope.$parent.path, true]);
          return;
        }

        console.log('broadcast for nextSibling of parent' + DataManipulationService.getId(scope.$parent.element));
        // look for the next sibling of the parent
        $rootScope.$broadcast("nextSibling",
            [DataManipulationService.getId(scope.$parent.element), parentIndex, parentPath, true]);
      };

      // watch for this field's next sibling
      scope.$on('nextSibling', function (event, args) {
        var id = args[0];
        var index = args[1];
        var path = args[2];
        var value = args[3];

        if (id === scope.getId() && path === scope.path) {
            console.log('on nextSibling of ' + DataManipulationService.getTitle(scope.field));


            var next = DataManipulationService.nextSibling(scope.field, scope.$parent.element);
            var parentIndex = parseInt(scope.lastIndex(path)) || 0;
            var parentPath = path.substring(0, path.lastIndexOf('-'));
            if (next) {

              console.log('got parent next sibling');
              $rootScope.$broadcast("setActive", [DataManipulationService.getId(next), 0, path, true]);

            } else {

              console.log('broadcast nextSibling of ' + DataManipulationService.getTitle(scope.$parent.element) + ' ' +  parentPath);

              // look for the next sibling of the parent
              $rootScope.$broadcast("nextSibling",
                  [DataManipulationService.getId(scope.$parent.element), parentIndex, parentPath, true]);
            }

        }
      });


      if (scope.field) {
        nestElement();
      }

      scope.$watch("field", function () {
        if (scope.field && !getNestedValue(scope.field)) {
          nestElement();
        }
      });
    }

  }
  ;

})
;
