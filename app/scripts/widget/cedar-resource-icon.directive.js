'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.widget.cedarResourceIconDirective', [])
      .directive('cedarResourceIcon', cedarResourceIconDirective);


  cedarResourceIconDirective.$inject = ['CONST'];

  function cedarResourceIconDirective(CONST) {


    var linker = function (scope, element, attrs) {

      scope.getResourceIconClass = function () {
        let result = scope.resourceType + " ";

        switch (scope.resourceType) {
          case CONST.resourceType.FOLDER:
            result += CONST.resourceIcon.FOLDER;
            break;
          case CONST.resourceType.TEMPLATE:
            result += CONST.resourceIcon.TEMPLATE;
            break;
          case CONST.resourceType.METADATA:
          case CONST.resourceType.INSTANCE:
            result += CONST.resourceIcon.INSTANCE;
            break;
          case CONST.resourceType.ELEMENT:
            result += CONST.resourceIcon.ELEMENT;
            break;
          case CONST.resourceType.FIELD:
            result += CONST.resourceIcon.FIELD;
            break;
        }
        return result;
      };

      scope.getResourceTypeClass = function () {
        let result = '';

        switch (scope.resourceType) {
          case CONST.resourceType.FOLDER:
            result += "folder";
            break;
          case CONST.resourceType.TEMPLATE:
            result += "template";
            break;
          case CONST.resourceType.METADATA:
          case CONST.resourceType.INSTANCE:
            result += "metadata";
            break;
          case CONST.resourceType.ELEMENT:
            result += "element";
            break;
          case CONST.resourceType.FIELD:
            result += "field";
            break;
        }

        return result;
      };

      scope.getResourceTypeLanguageKey = function () {
        let result = 'resourceType.' + scope.resourceType;
        return result;
      };

    };

    return {
      templateUrl: 'scripts/widget/cedar-resource-icon.directive.html',
      restrict   : 'EA',
      scope      : {
        resourceType: '='
      },
      controller : function ($scope, $element) {
      },
      replace    : true,
      link       : linker
    };

  }

})
;
