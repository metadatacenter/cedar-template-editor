'use strict';

angularApp.directive('fieldDirective', function($rootScope, $http, $compile, $document) {

  var linker = function($scope, $element, attrs) {

    // When form submit event is fired, check field for simple validation
    $scope.$on('submitForm', function (event) {
      // If field is required and is empty, emit failed emptyRequiredField event
      if ($scope.field.properties.info.required_value) {
        var allRequiredFieldsAreFilledIn = true;
        var min = $scope.field.minItems || 1;

        if (angular.isArray($scope.model)) {
          if ($scope.model.length < min) {
            allRequiredFieldsAreFilledIn = false;
          } else {
            angular.forEach($scope.model, function(valueElement) {
              if (!valueElement || !valueElement.value) {
                allRequiredFieldsAreFilledIn = false;
              } else if (angular.isArray(valueElement.value)) {
                var hasValue = false;
                angular.forEach(valueElement.value, function(ve) {
                  hasValue = hasValue || !!ve;
                });

                if (!hasValue) {
                  allRequiredFieldsAreFilledIn = false;
                }
              } else if (angular.isObject(valueElement.value)) {
                if ($rootScope.isEmpty(valueElement.value)) {
                  allRequiredFieldsAreFilledIn = false;
                } else if ($scope.field.properties.info.date_type == "date-range") {
                  if (!valueElement.value.start || !valueElement.value.end) {
                    allRequiredFieldsAreFilledIn = false;
                  }
                }
              }
            });
          }
        } else {
          allRequiredFieldsAreFilledIn = false;
        }

        if (!allRequiredFieldsAreFilledIn) {
          // add this field instance the the emptyRequiredField array
          $scope.$emit('emptyRequiredField', ['add', $scope.field.properties.info.title, $scope.uuid]);
        }
      }

      // If field is required and is not empty, check to see if it needs to be removed from empty fields array
      if ($scope.field.properties.info.required_value && allRequiredFieldsAreFilledIn) {
        //remove from emptyRequiredField array
        $scope.$emit('emptyRequiredField', ['remove', $scope.field.properties.info.title, $scope.uuid]);
      }
    });

    var field = $scope.field.properties.info
    // Checking each field to see if required, will trigger flag for use to see there is required fields
    if (field.required) {
      $scope.$emit('formHasRequiredFields');
    }

    // If a default value is set from the field item configuration, set $scope.model to its value
    if ($scope.directory == 'render') {
      if ($scope.model) {
        var min = $scope.field.minItems || 1;

        if (['checkbox'].indexOf(field.input_type) != -1) {
          if (field.default_option) {
            for (var i = 0; i < min; i++) {
              $scope.model[i]["value"] = field.default_option;
            }
          } else {
            for (var i = 0; i < min; i++) {
              $scope.model[i]['value'] = {};
            }
          }
        } else {
          for (var i = 0; i < min; i++) {
            if (['checkbox'].indexOf(field.input_type) >= 0 ||
                ['date'].indexOf(field.input_type) >= 0 && field.date_type == "date-range") {
              $scope.model[i]['value'] = {};
            } else if (['list'].indexOf(field.input_type) >= 0) {
              $scope.model[i]['value'] = [];
            } else {
              $scope.model[i]['value'] = "";
            }
          }
        }
      }
    }

    $scope.uuid = $rootScope.generateGUID();

    // Retrive appropriate field template file
    $scope.getTemplateUrl = function() {
      var input_type = 'element';
      if ($scope.field.properties.info.input_type) {
        input_type = $scope.field.properties.info.input_type;
      }
      return './views/directive-templates/field-' + $scope.directory + '/' + input_type + '.html';
    }

    $scope.addMoreInput = function() {
      if ($scope.field.maxItems == "N" || $scope.model.length < $scope.field.maxItems) {
        var seed = angular.copy($scope.model[0]);

        if (field.default_option) {
          seed["value"] = field.default_option;
        } else {
          if (['checkbox'].indexOf(field.input_type) >= 0 ||
              ['date'].indexOf(field.input_type) >= 0 && field.date_type == "date-range") {
            seed['value'] = {};
          } else if (['list'].indexOf(field.input_type) >= 0) {
            seed['value'] = [];
          } else {
            seed['value'] = "";
          }
        }

        $scope.model.push(seed);
      }
    }

    $scope.removeInput = function(index) {
      if ($scope.model.length > $scope.field.minItems) {
        $scope.model.splice(index, 1);
      }
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