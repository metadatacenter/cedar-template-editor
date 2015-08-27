'use strict';

angularApp.directive('fieldDirective', function($http, $compile, $document) {

  var linker = function($scope, $element, attrs) {
    // If we use this field-directive to 'render' and not 'preview' && this model is undefined
    if ($scope.directory == 'render' && $scope.model == undefined) {
      // Assign $scope.model to object by default to help child field scopes easily assign values to it
      $scope.model = {};
    }

    // When form submit event is fired, check field for simple validation
    $scope.$on('submitForm', function (event) {
      // If field is required and is empty, emit failed emptyRequiredField event
      if ($scope.field.properties.info.required && $scope.model == undefined) {
        $scope.$emit('emptyRequiredField', $scope.field.properties.info.title);
      }
    });

    // Checking each field to see if required, will trigger flag for use to see there is required fields
    if ($scope.field.properties.info.required) {
      $scope.$emit('formHasRequiredFields');
    }

    // Retrive appropriate field template file
    $scope.getTemplateUrl = function() {
      return './views/directive-templates/field-' + $scope.directory + '/' + $scope.field.properties.info.input_type + '.html';
    }
  }

  return {
    template : '<div ng-include="getTemplateUrl()"></div>',
    restrict: 'EA',
    scope: {
      directory: '@',
      field: '=',
      model: '=',
      delete: '&',
      add: '&',
      option: '&'
    },
    replace: true,
    link: linker
  };
});