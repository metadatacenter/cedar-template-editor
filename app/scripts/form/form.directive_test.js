'use strict';

define(['app',
        'angular',

        'jquery'
], function (app) {

  xdescribe('Directive: form', function () {

    // Load the modules we need
    beforeEach(module(app.name));
    // Load the new module containing templates
    beforeEach(module('my.templates'));
    // Load the field directive
    beforeEach(module('cedar.templateEditor.form.formDirective'));

    var $scope;
    var $compile;
    var $httpBackend;

    beforeEach(inject(function (_$rootScope_, _$compile_, _$httpBackend_) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
      $httpBackend = _$httpBackend_;
    }));

    it("dummy test", function () {

      $httpBackend.expectGET('resources/i18n/locale-en.json').respond(200, {});

      // $compile the template, and pass in the $scope.
      // This will find your directive and run everything
      var template = $compile("<div><form-directive>Hello world</form-directive></div>")($scope);

      // Now run a $digest cycle to update your template with new data
      $scope.$digest();

      // Render the template as a string
      var templateAsHtml = template.html();

      console.log(templateAsHtml);

      // var $scope = $rootScope.$new();
      // console.log($scope.pageTitle);

      // var list = element.find('li');
      // expect(list.length).toBe(7);
      //expect(7).toBe(7);
    });
  });
});
