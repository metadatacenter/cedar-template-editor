'use strict';
define(['angular', 'CedarValidationPolicy'], function (angular, policy) {
  // Preserve Angular's omission of private bookkeeping, while keeping exact numeric atoms.
  function view(value) {
    if (policy.ExactDecimal.isExact(value)) return value;
    if (Array.isArray(value)) return value.map(view);
    if (value instanceof Date) return value.toJSON();
    if (typeof value === 'function') return undefined;
    if (!value || typeof value !== 'object') return value;
    var result = {};
    Object.keys(value).forEach(function (key) {
      if (key.indexOf('$$') !== 0) Object.defineProperty(result, key,
          {value: view(value[key]), enumerable: true, configurable: true, writable: true});
    });
    return result;
  }
  var source = {
    stringify: function (value, indent) { return policy.JsonSourcePolicy.stringify(view(value), indent || 0); },
    parse: function (text) { return policy.JsonSourcePolicy.parse('{"value":' + text + '}').value; },
    isExact: policy.ExactDecimal.isExact
  };
  angular.module('cedar.templateEditor.core.jsonSourcePolicy', [])
      .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.transformResponse.unshift(function (data, headers) {
          if (typeof data !== 'string' || !data) return data;
          var json = data.replace(/^\)\]\}',?\n/, '');
          if (/^\s*[\[{]/.test(json) || /application\/json/i.test(headers('content-type') || ''))
            return source.parse(json);
          return data;
        });
      }]);
  return source;
});
