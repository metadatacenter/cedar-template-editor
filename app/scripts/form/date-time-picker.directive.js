'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.dateTimePickerDirective', [])
      .directive('dateTimePicker', dateTimePickerDirective);

  // TODO: refactor to cedarDateTimePicker <cedar-date-time-picker>

  dateTimePickerDirective.$inject = [];

  /**
   * Enables Bootstrap datepickers for date inputs.
   */
  function dateTimePickerDirective() {
    return {

      restrict: 'A',
      link    : function ($scope, $element, attrs) {
        // Assign variable to actual input element
        var inputElement = $element.children('.form-control');

        $element.datetimepicker({
          icons: {
            time    : 'fa fa-clock-o',
            date    : 'fa fa-calendar',
            up      : 'fa fa-lg fa-angle-up',
            down    : 'fa fa-lg fa-angle-down',
            previous: 'fa fa-lg fa-angle-left',
            next    : 'fa fa-lg fa-angle-right',
            today   : 'glyphicon glyphicon-screenshot',
            clear   : 'fa fa-trash',
          },
          format:'MM/DD/YYYY'

        }).on('dp.change', function () {
          // Each time the date-time-picker date is changed trigger change function
          // ngModel listens for "input" event, so need to let Angular know to listen for when change event happens
          inputElement.trigger('input');
        });
      }
    };
  };

});