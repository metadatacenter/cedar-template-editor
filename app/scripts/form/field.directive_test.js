'use strict';

define(['app', 'angular', 'angularMocks'], function(app) {

  describe('Directive: field', function () {
    beforeEach(module('cedar.templateEditor.form.fieldDirective'));

    beforeEach(inject(function($rootScope, $controller) {

    }));

    it("dummy test", function () {
      // var $scope = $rootScope.$new();
      // console.log($scope.pageTitle);

      // var list = element.find('li');
      // expect(list.length).toBe(7);
      expect(7).toBe(7);
    });
  });
});
