'use strict';

define(['app', 'angular'], function (app) {

  describe('field.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller; // responsible for instantiating controllers
    var $httpBackend;
    var $templateCache;
    var $fieldDirectiveScope;
    var DataManipulationService;
    var StagingService;
    var createdForm;
    var compiledDirective;
    var fieldId;

    // Load the module that contains the templates that were loaded with html2js
    beforeEach(module('my.templates'));
    // Load other modules
    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.template.createTemplateController'));
    beforeEach(module('cedar.templateEditor.form.fieldDirective'));
    beforeEach(module('cedar.templateEditor.service.stagingService'));
    beforeEach(module('cedar.templateEditor.service.dataManipulationService'));

    // Mock the controlledTermDirectiveControlled because we don't need it for these tests
    beforeEach(function () {
      module('cedar.templateEditor.controlledTerm.controlledTermDirectiveController',
          function ($provide, $controllerProvider) {
            $controllerProvider.register('controlledTermDirectiveController', function ($scope) {
              // empty controller
            });
          });
    });

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_, _$templateCache_,
                  _DataManipulationService_,
                  _StagingService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          $templateCache = _$templateCache_;
          DataManipulationService = _DataManipulationService_;
          StagingService = _StagingService_;
        }));

    beforeEach(function () {
      // returns the appropriate file content when requested
      $httpBackend.whenGET('resources/i18n/locale-en.json').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'resources/i18n/locale-en.json', false);
        request.send(null);
        return [request.status, request.response, {}];
      });
    });

    // Create field given the field type (e.g. checkbox)
    var createField = function (fieldType) {
      var $createTemplateControllerScope = $rootScope.$new(true) // create a new, isolated scope
      // Initialize the CreateTemplateController
      $controller('CreateTemplateController', {
        $rootScope: $rootScope,
        $scope    : $createTemplateControllerScope
      });

      // Define the variables needed to create the field
      createdForm = $createTemplateControllerScope.form;
      $fieldDirectiveScope = $rootScope.$new(true) // create a new, isolated scope
      var domId = DataManipulationService.createDomId();
      var callback = function () {
      }; // mock the callback function

      // Create field and add it to the form
      $fieldDirectiveScope.field = StagingService.addFieldToForm(createdForm, fieldType, domId, callback);
      fieldId = $fieldDirectiveScope.field['@id'];
      // Compile field directive
      var fieldDirective = "<field-directive nested='false' field='field' model='model'></field-directive>";
      compiledDirective = $compile(fieldDirective)($fieldDirectiveScope);
      // Now run a $digest cycle
      $fieldDirectiveScope.$digest();
    };

    describe('A checkbox field', function () {

      beforeEach(function () {
        createField('checkbox');
      });

      it("should have one option by default", function () {
        // Here, the $ symbol enables the use of jQuery's find method. By default Angular uses jqLite, which is limited
        // to find tag names. jQuery's find expressions are much more powerful
        expect($(compiledDirective).find("input[id^='checkbox']").length).toBe(1);
        // Check the template model
        expect($fieldDirectiveScope.field._valueConstraints.literals.length).toBe(1);
      });

      it("should add new options when clicking on 'Add another'", function () {
        // Add three additional options
        $(compiledDirective).find('.add-another').click();
        $(compiledDirective).find('.add-another').click();
        $(compiledDirective).find('.add-another').click();
        expect($(compiledDirective).find("input[id^='checkbox']").length).toBe(4);
        // Check the template model
        expect($fieldDirectiveScope.field._valueConstraints.literals.length).toBe(4);
      });

    });
  });
});
