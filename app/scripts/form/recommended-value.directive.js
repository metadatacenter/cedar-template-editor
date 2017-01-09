'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.recommendedValue', [])
      .directive('recommendedValue', recommendedValue);


  recommendedValue.$inject = ["$rootScope", "$sce", "$document", "$translate", "$filter", "$location",
                              "$window", '$timeout',
                              "SpreadsheetService",
                              "DataManipulationService", "controlledTermDataService",
                              "StringUtilsService", 'UISettingsService'];

  function recommendedValue($rootScope, $sce, $document, $translate, $filter, $location, $window,
                            $timeout,
                            SpreadsheetService,
                            DataManipulationService,
                            controlledTermDataService, StringUtilsService, UISettingsService) {


    var linker = function ($scope, $element, attrs) {

      $scope.valueElement = $scope.$parent.valueArray[$scope.index];
      $scope.isFirstRefresh = true;


      // is the field multiple cardinality?
      $scope.isMultipleCardinality = function () {
        return DataManipulationService.isMultipleCardinality($scope.field);
      };


      // Used just for text fields whose values have been constrained using controlled terms
      $scope.$watch("model", function () {

        $scope.isEditState = function () {
          return (DataManipulationService.isEditState($scope.field));
        };

        $scope.isNested = function () {
          return (DataManipulationService.isNested($scope.field));
        };

        $scope.addOption = function () {
          return (DataManipulationService.addOption($scope.field));
        };

      }, true);


      // Updates the model for fields whose values have been constrained using controlled terms
      $scope.updateModelFromUIControlledField = function () {

        // Multiple fields
        if ($scope.isMultipleCardinality()) {
          if ($scope.modelValue.length > 0) {
            angular.forEach($scope.modelValue, function (m, i) {
              if (m && m['@value'] && m['@value']['@id']) {
                $scope.model[i] = {
                  "@value"   : m['@value']['@id'],
                  _valueLabel: m['@value'].label
                };
              }
            });
          }
          else {
            // Default value
            $scope.model = [{'@value': null}];
          }

        }
        // Single fields
        else {
          $scope.model['@value'] = $scope.modelValue[0]['@value']['@id'];
          $scope.model._valueLabel = $scope.modelValue[0]['@value']['label'];
        }
      };


      $scope.updateUIFromModelControlledField = function () {

        if ($rootScope.isArray($scope.model)) {
          $scope.modelValue = [];
          angular.forEach($scope.model, function (m, i) {
            $scope.modelValue[i] = {};
            $scope.modelValue[i]['@value'] = {
              '@id': m['@value'],
              label: m._valueLabel
            };
          });
        }
        else {
          $scope.modelValue = [];
          $scope.modelValue[0] = {};
          $scope.modelValue[0]['@value'] = {
            '@id': $scope.model['@value'],
            label: $scope.model._valueLabel
          };
        }
      };

      //
      // initialization
      //

      // Initializes model for fields constrained using controlled terms
      $scope.updateUIFromModelControlledField();
      // Load values when opening an instance
      if ($scope.model) {
        $scope.modelValueRecommendation = {'@value': {'value': $scope.model['@value']}}
      }


      $scope.updateModelWhenChangeSelection = function (modelvr) {

        // This variable will be used at textfield.html
        $scope.modelValueRecommendation = modelvr;
        if ($rootScope.isArray($scope.model)) {
          angular.forEach(modelvr, function (m, i) {
            if (m && m['@value'] & m['@value'].value) {
              $scope.model[i]['@value'] = m['@value'].value;
            } else {
              delete $scope.model[i]['@value'];
            }
          });
        } else {
          //var newValue = modelvr['@value'].value;
          $scope.model['@value'] = modelvr['@value'].valueUri;
          $scope.model['_valueLabel'] = modelvr['@value'].value;

        }
      };


      $scope.initializeValueRecommendationField = function () {

        $scope.isFirstRefresh = true;

        $scope.modelValueRecommendation = {};
        if ($scope.model) {
          if ($scope.model['_valueLabel']) {
            $scope.modelValueRecommendation['@value'] = {
              'value'   : $scope.model._valueLabel,
              'valueUri': $scope.model['@value'],
            };
          }
          else {
            $scope.modelValueRecommendation['@value'] = {
              'value': $scope.model['@value']
            };
          }
        }

        console.log($scope.modelValueRecommendation);
      };


      $scope.clearSearch = function (select) {
        select.search = '';
      };


      $scope.setIsFirstRefresh = function (value) {

        $scope.isFirstRefresh = value;
        console.log('setIsFirstRefresh' + $scope.isFirstRefresh);
      };

      $scope.updateModelWhenRefresh = function (select, modelvr) {
        console.log("updateModelWhenRefresh" + $scope.isFirstRefresh);
        if (!$scope.isFirstRefresh) {
          // Check that there are no controlled terms selected
          if (select.selected.valueUri == null) {

            // If the user entered a new value
            if (select.search != modelvr['@value'].value) {
              var modelValue;
              if (select.search == "" || select.search == undefined) {
                modelValue = null;
              }
              else {
                modelValue = select.search;
              }
              $scope.model['@value'] = modelValue;
              delete $scope.model['_valueLabel'];
              $scope.modelValueRecommendation['@value'].value = modelValue;
            }

          }
        }
      };

      $scope.clearSelection = function ($event, select) {
        $event.stopPropagation();
        $scope.modelValueRecommendation = {
          '@value': {'value': null, 'valueUri': null},
        }
        select.selected = undefined;
        select.search = "";
        $scope.model['@value'] = null;
        delete $scope.model['_valueLabel'];
      };

      $scope.calculateUIScore = function (score) {
        var s = Math.floor(score * 100);
        if (s < 1) {
          return "<1%";
        }
        else {
          return s.toString() + "%";
        }
      };

      //
      // initialize value recommendation directive
      //
      $scope.initializeValueRecommendationField();




    };

    return {
      templateUrl: 'scripts/form/recommended-value.directive.html',
      restrict   : 'EA',
      scope      : {
        field  : '=',
        'model': '=',
        index  : '=',

      },
      controller : function ($scope, $element) {
        var addPopover = function ($scope) {
          //Initializing Bootstrap Popover fn for each item loaded
          setTimeout(function () {
            if ($element.find('#field-value-tooltip').length > 0) {
              $element.find('#field-value-tooltip').popover();
            } else if ($element.find('[data-toggle="popover"]').length > 0) {
              $element.find('[data-toggle="popover"]').popover();
            }
          }, 1000);
        };

        addPopover($scope);

      },
      replace    : true,
      link       : linker
    };

  }

})
;