'use strict';

angularApp.directive('fieldDirective', function($http, $compile, $document) {

  var linker = function($scope, $element, attrs) {

    // When form submit event is fired, check field for simple validation
    $scope.$on('submitForm', function (event) {
      // If field is required and is empty, emit failed emptyRequiredField event
      if ($scope.field.properties.info.required && !$scope.model['value']) {
        // add this field instance the the emptyRequiredField array
        $scope.$emit('emptyRequiredField', ['add', $scope.field.properties.info.title]);
      }
      // If field is required and is not empty, check to see if it needs to be removed from empty fields array
      if ($scope.field.properties.info.required && $scope.model['value']) {
        //remove from emptyRequiredField array
        $scope.$emit('emptyRequiredField', ['remove', $scope.field.properties.info.title]);
      }
    });

    var field = $scope.field.properties.info
    // Checking each field to see if required, will trigger flag for use to see there is required fields
    if (field.required) {
      $scope.$emit('formHasRequiredFields');
    }

    // If a default value is set from the field item configuration, set $scope.model to its value
    if ($scope.directory == 'render' && ['radio', 'checkbox'].indexOf(field.input_type) != -1) {
      if (!$scope.model['value'] && field.default_option) {
        $scope.model['value'] = field.default_option;
      }
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