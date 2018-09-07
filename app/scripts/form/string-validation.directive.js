'use strict';

define([
  'angular'
], function (angular) {
  angular.module('cedar.templateEditor.form.stringValidationDirective', [])
      .directive('stringValidation', stringValidationDirective);


  stringValidationDirective.$inject = [];

  function stringValidationDirective() {

    return {
      require: "ngModel",
      link    : function (scope, elm, attrs, ctrl) {

        var withMin = true;
        var withMax = true;

        ctrl.$validators.string = function(modelValue, viewValue) {

          if (ctrl.$isEmpty(modelValue)) {
            // consider empty models to be valid
            return true;
          }


          if (attrs.minlength) {
            withMin = viewValue.length >= attrs.minlength;
          }

          if (attrs.maxlength) {
            withMax = viewValue.length <= attrs.maxlength;
          }

          // is it valid?
          if (withMin && withMax) {
            elm[0].setCustomValidity("");
            return true;
          }

          // it is invalid
          var message  = "The value ";
          if (!withMin || !withMax) {
            message += ' must be between  ' + attrs.minlength + ' and ' + attrs.maxlength + ' characters.';
          }

          elm[0].setCustomValidity(message);
          elm[0].reportValidity();
          return false;
        };

      }
    };
  }

});

