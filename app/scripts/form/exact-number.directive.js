'use strict';
define(['angular', 'CedarValidationPolicy'], function (angular, policy) {
  angular.module('cedar.templateEditor.form.exactNumber', [])
      .directive('cedarExactNumber', function () {
        return {
          restrict: 'A', require: 'ngModel', priority: 1,
          link: function (_scope, _element, _attrs, model) {
            // Run after input[number] installed its float parser. Keep the existing control,
            // empty/null behavior and validators, but never round its text through parseFloat.
            model.$parsers.length = 0;
            model.$formatters.length = 0;
            model.$parsers.push(function (text) {
              if (model.$isEmpty(text)) { model.$setValidity('number', true); return null; }
              try {
                var value = policy.NumericPolicy.value(text);
                model.$setValidity('number', true);
                return value;
              } catch (_) { model.$setValidity('number', false); return undefined; }
            });
            model.$formatters.push(function (value) { return value == null ? '' : String(value); });
          }
        };
      });
});
