'use strict';

// coffeescript's for in loop
var __indexOf = [].indexOf || function(item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }
  return -1;
};

angularApp.directive('fieldDirective', function($http, $compile, $document) {

  var getTemplateUrl = function(field, directory) {
    var templateUrl = './views/directive-templates/field-'+directory+'/',
        supported_fields = [
          'textfield',
          'email',
          'textarea',
          'checkbox',
          'date',
          'location',
          'radio',
          'list',
          'audio-visual',
          'numeric',
          'phone-number',
          'section-break',
          'page-break',
          'controlled-term'
        ];

    if (__indexOf.call(supported_fields, field.properties.info.input_type) >= 0) {
        return templateUrl += field.properties.info.input_type + '.html';
    }
  };

  var linker = function($scope, $element, attrs) {
    // Assigning $scope.model to object by default to help child scopes assign values to it
    $scope.model = $scope.model || {};

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
    // GET template content from path
    var templateUrl = getTemplateUrl($scope.field, $scope.directory);
    $http.get(templateUrl).success(function(data) {
      $element.html(data);
      $compile($element.contents())($scope);
    });
  }

  return {
    template: '<div ng-bind="field"></div>',
    restrict: 'EA',
    scope: {
      directory: '@',
      field: '=',
      model: '=',
      delete: '&',
      add: '&',
      option: '&'
    },
    transclude: true,
    replace: true,
    link: linker
  };
});