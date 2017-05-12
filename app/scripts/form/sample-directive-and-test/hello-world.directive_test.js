'use strict';

define(['app',
        'angular',
        'angularMocks',
        'jquery',
], function (app, angular) {

  describe('Hello World Directive', function () {

    // Load the new module containing templates
    beforeEach(module('my.templates'));
    // Load the field directive
    beforeEach(module('cedar.templateEditor.form.helloWorldDirective'));

    var $scope;
    var $compile;

    beforeEach(inject(function (_$rootScope_, _$compile_) {
      $scope = _$rootScope_.$new();
      $compile = _$compile_;
    }));

    it("dummy test", function () {
      //$compile the template, and pass in the $scope.
      //This will find your directive and run everything
      var template = $compile("<div><hello-world-directive></hello-world-directive></div>")($scope);

      //Now run a $digest cycle to update your template with new data
      $scope.$digest();

      //Render the template as a string
      var templateAsHtml = template.html();
      console.log(templateAsHtml);
    });
  });
});
