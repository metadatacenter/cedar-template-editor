'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.selectPickerDirective', [])
      .directive('selectPicker', selectPickerDirective);

  // TODO: refactor to cedarSelectPicker <cedar-select-picker>

  selectPickerDirective.$inject = ['$rootScope', '$timeout', '$document'];

  /**
   * Enables Bootstrap datepickers for date inputs.
   */
  function selectPickerDirective($rootScope, $timeout, $document) {

    return {
      restrict: 'A',
      scope   : {
        field: '=',
        block: '='
      },
      link    : function ($scope, $element, attrs) {
        // update local $scope.model to value of $parent.model if available

        if ($scope.$parent.model != undefined) {
          $scope.model = $scope.$parent.model;

        }

        var default_array;

        if ($scope.model != undefined) {

          // If returning to an already populated select list field, load selections
          default_array = $scope.model['@value'];

        } else if ($scope.field && $scope.field._valueConstraints.defaultOptions) {

          default_array = [];

          // If default select options have been set for an empty field
          var defaultOptions = $scope.field._valueConstraints.defaultOptions;

          for (var property in defaultOptions) {
            if (defaultOptions.hasOwnProperty(property)) {
              // Push into array that is set via $element.selectpicker 'val' method
              default_array.push(property);
            }
          }
          $scope.model = $scope.model || {};
          $scope.model['@value'] = default_array;
        } else {
        }

        $timeout(function () {
          $element.selectpicker({
            style   : 'btn-select-picker',
            iconBase: 'fa',
            tickIcon: 'fa-check',
          });

          if (default_array) {
            // If defaults were loaded during field item configuration, manually load defaults into the selectpicker
            $element.selectpicker('val', default_array);
          }

          // if a block id is defined, then toggle stuff inside the block.  this is for the share dialog
          if ( $scope.block) {
            var str = "<i style='font-size:16px;margin-right:10px' class='fa fa-pencil pull-right'></i><span class='caret glyphicon glyphicon-chevron-down' style='display:block'></span>";

            jQuery($scope.block + "  > div.confirmation > div > button.btn.btn-save" ).click(function() {
              $timeout(function () {
                jQuery($scope.block + " > div.row > div.btn-group.bootstrap-select.select-picker > button > span.filter-option.pull-left").html(str);
              });
            });

            jQuery($scope.block + "  > div.confirmation > div > button.btn.btn-clear").click(function() {
              $timeout(function () {
                jQuery($scope.block + " > div.row > div.btn-group.bootstrap-select.select-picker > button > span.filter-option.pull-left").html(str);
              });
            });

            jQuery($scope.block + " > div.row > div.btn-group.bootstrap-select.select-picker > button > span.filter-option.pull-left").html(str);
            jQuery('.caret').addClass('glyphicon').addClass('glyphicon-chevron-down');
          }

        }, 25);
        $element.on('change', function () {
          // Runtime document output is 3 $scope levels above this directive at this point, passing the $model up to be
          // assigned at the field-directive.js level

          $scope.model = $element.val();
          jQuery('.bootstrap-select').toggleClass('open');
        });
      }
    };
  };

});