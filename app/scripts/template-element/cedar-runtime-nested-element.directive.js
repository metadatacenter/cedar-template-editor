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
        fieldKey      : "=",
        parentKey     : "=",
        field         : '=',
        model         : '=',
        labels        : "=",
        relabel       : '=',
        preview       : "=",
        removeChild   : '=',
        ngDisabled    : "=",
        renameChildKey: "=",
        isEditData    : "=",
        path          : '=',
        uid           : '='
      },
      replace : true,
      link    : linker
    };

    return directive;

    function linker(scope, element, attrs) {


      var nestElement = function () {

        setNested(scope.field);
        var template = '<div ng-if="$root.schemaOf(field)._ui.inputType" > <cedar-runtime-field field="field" model="model" delete="removeChild(field)" preview="false" rename-child-key="renameChildKey" is-edit-data="isEditData" uid="uid" path="path" parent-key="parentKey" field-key="fieldKey"></cedar-runtime-field></div><div ng-if="!$root.schemaOf(field)._ui.inputType" class="nested-element"><cedar-runtime-element labels="labels" relabel="relable"  model="model" element="field" preview="preview" delete="removeChild(field)"  uid="uid"  path="path" parent-key="parentKey" field-key="fieldKey"></cedar-runtime-element></div>';
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


      // // find the next child of a field
      // scope.nextChild = function (field, index, path, fieldKey, parentKey) {
      //   console.log('nextChild of ' + fieldKey + ' in ' + parentKey);
      //
      //   if (fieldKey && parentKey) {
      //
      //     var props = DataManipulationService.getFieldSchema(scope.$parent.element).properties;
      //     var order = DataManipulationService.getFieldSchema(scope.$parent.element)._ui.order;
      //
      //     var idx = order.indexOf(fieldKey);
      //     idx += 1;
      //     var found = false;
      //     while (idx < order.length && !found) {
      //       var nextKey = order[idx];
      //       var next = props[nextKey];
      //       found = !DataManipulationService.isStaticField(next);
      //       idx += 1;
      //     }
      //     if (found) {
      //       console.log('found ' + nextKey);
      //       $rootScope.$broadcast("setActive", [DataManipulationService.getId(next), index, scope.path, nextKey, scope.parentKey,  true]);
      //       return next;
      //     } else {
      //       console.log('not found');
      //     }
      //   }
      //
      //
      //   //var next = DataManipulationService.nextSibling(scope.$parent.element, fieldKey);
      //   var parentIndex = parseInt(scope.lastIndex(path)) || 0;
      //   var parentPath = path.substring(0, path.lastIndexOf('-'));
      //
      //   // if (next) {
      //   //   console.log('found next');
      //   //
      //   //
      //   //   // field's next sibling
      //   //   //$rootScope.$broadcast("setActive", [DataManipulationService.getId(next), index, scope.path, true]);
      //   //   return;
      //   // }
      //
      //   if (scope.$parent.isMultiple() && (parentIndex + 1 < scope.$parent.model.length)) {
      //
      //     console.log('broadcast for multiple ' +DataManipulationService.getId(scope.$parent.element) + ' ' + scope.$parent.path + ' '  + (parentIndex+1));
      //     // next parent index if multiple
      //     //$rootScope.$broadcast("setActive",
      //     //    [DataManipulationService.getId(scope.$parent.element), parentIndex + 1, scope.$parent.path, true]);
      //     return;
      //   }
      //
      //   // look for the next sibling of the parent
      //   //$rootScope.$broadcast("nextSibling",
      //       //[DataManipulationService.getId(scope.$parent.element), parentIndex, parentPath, true]);
      //   console.log(scope.$parent);
      //   var elem = scope.$parent.element;
      //   scope.$parent.activateNextSiblingOf(parentKey, grandparentKey);
      // };

      scope.activateNextSiblingOf = function(fieldKey, parentKey) {
        scope.$parent.activateNextSiblingOf(fieldKey, parentKey);
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

  }
  ;

})
;
