'use strict';
define(['angular', 'angularMocks', 'CedarValidationPolicy', 'cedar/template-editor/core/json-source-policy',
  'cedar/template-editor/form/exact-number.directive'], function (angular, _mocks, policy, source) {
  describe('Exact numeric source and inputs:', function () {
    beforeEach(module('cedar.templateEditor.core.jsonSourcePolicy', 'cedar.templateEditor.form.exactNumber'));
    it('preserves numbers and strips Angular private fields', function () {
      var object = source.parse('{"minValue":9007199254740993,"maxValue":0.10000000000000001}');
      object.$$cedarEtag = 'private';
      expect(source.stringify(angular.copy(object))).toBe('{"minValue":9007199254740993,"maxValue":0.10000000000000001}');
      expect(function () { source.parse('{"a":1,"a":2}'); }).toThrow();
    });
    it('reads exact JSON over HTTP before the Angular float parser', inject(function ($http, $httpBackend) {
      var received;
      $httpBackend.expectGET('/artifact').respond('{"n":9007199254740993}', {'Content-Type': 'application/json'});
      $http.get('/artifact').then(function (r) { received = r.data; });
      $httpBackend.flush();
      expect(String(received.n)).toBe('9007199254740993');
    }));
    it('keeps exact typed bounds and the empty/null behavior', inject(function ($rootScope, $compile) {
      var scope = $rootScope.$new();
      scope.value = null;
      var input = $compile('<input type="number" cedar-exact-number ng-model="value">')(scope);
      scope.$digest();
      var model = input.controller('ngModel');
      model.$setViewValue('9007199254740993');
      scope.$digest();
      expect(String(scope.value)).toBe('9007199254740993');
      expect(model.$valid).toBe(true);
      model.$setViewValue('');
      scope.$digest();
      expect(scope.value).toBe(null);
      scope.$destroy();
    }));
  });
});
