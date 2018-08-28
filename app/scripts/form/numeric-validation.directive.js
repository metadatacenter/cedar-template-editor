'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.numericValidationDirective', [])
      .directive('numericValidation', numericValidationDirective);


  numericValidationDirective.$inject = [];

  function numericValidationDirective() {

    return {
      require: "ngModel",
      link    : function (scope, elm, attrs, ctrl) {

        var withPattern = true;
        var withMin = true;
        var withMax = true;

        ctrl.$validators.numeric = function(modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid
            return true;
          }

          if (attrs.pattern) {
            var regex = RegExp(attrs.pattern);
            withPattern = regex.test(viewValue);
          }

          if (attrs.min) {
            withMin = viewValue >= attrs.min;
          }

          if (attrs.max) {
            withMax = viewValue <= attrs.max;
          }

          // is it valid?
          if (withMin && withMax && withPattern) {
            elm[0].setCustomValidity("");
            return true;
          }

          // it is invalid
          var message  = "The value ";
          if (!withMin || !withMax) {
            message += ' must be between  ' + attrs.min + ' and ' + attrs.max;
          } else {
            if (!withPattern) {
              message = 'Please match the required format.'
            }
          }

          elm[0].setCustomValidity(message);
          elm[0].reportValidity();
          return false;
        };

      }
    };
  }

});

