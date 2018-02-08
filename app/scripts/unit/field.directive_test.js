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
    var UrlService;
    var createdTemplate;
    var createdTemplateElement;
    var compiledDirective;
    var fieldId;

    var appData = applicationData.getConfig();

    // Load the module that contains the templates that were loaded with html2js
    beforeEach(module('my.templates'));
    // Load other modules
    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.template.createTemplateController'));
    beforeEach(module('cedar.templateEditor.templateElement.createElementController'));
    beforeEach(module('cedar.templateEditor.form.fieldDirective'));
    beforeEach(module('cedar.templateEditor.service.stagingService'));
    beforeEach(module('cedar.templateEditor.service.dataManipulationService'));
    beforeEach(angular.mock.module(function ($provide) {
      $provide.service('UserService', function mockUserService() {
        var userHandler = null;
        var service = {serviceId: "UserService"};
        service.getToken = function() {};
        service.injectUserHandler = function (userHandler) {};
        service.updateOwnUser = function (instance) {};
        return service;
      });
    }));

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
                  _StagingService_,
                  _UrlService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          $templateCache = _$templateCache_;
          DataManipulationService = _DataManipulationService_;
          StagingService = _StagingService_;
          UrlService = _UrlService_;
        }));

    beforeEach(function () {
      httpData.init($httpBackend);
      httpData.getFile('resources/i18n/locale-en.json');
      httpData.getFile('img/plus.png');
      httpData.getUrl(UrlService.base(), 'messaging', '/summary');
    });



    /* TESTS FOR FIELDS ADDED TO A TEMPLATE */
    describe('In a template,', function () {
      /* Checkbox */
      describe('a checkbox field', function () {
        beforeEach(function () {
          addFieldToTemplate('checkbox');
        });
        checkboxTests();
      });

      describe('a text field', function () {
        beforeEach(function () {
          addFieldToTemplate('textfield');
        });
        textfieldTests();
      });
    });


    /* TESTS FOR FIELDS ADDED TO A TEMPLATE ELEMENT */
    describe('In a template element,', function () {
      /* Checkbox */
      describe('a checkbox field', function () {
        beforeEach(function () {
          addFieldToTemplateElement('checkbox');
        });
        checkboxTests();
      });

      describe('a text field', function () {
        beforeEach(function () {
          addFieldToTemplateElement('textfield');
        });
        textfieldTests();
      });
    });


    // Note that this functions have been defined as 'function declarations', so they are
    // loaded before any code is executed. The alternative would be to declare them as 'function expressions', which are
    // loaded only when the interpreter reaches them, but then they would have to be moved to the beginning of the file.
    function checkboxTests() {

      var addAnotherSelector = ".add-another";
      var checkBoxSelector = "input[id^='checkbox']";
      var unselectedOptionClass = 'ng-empty';
      var selectedOptionClass = 'ng-not-empty';
      var hiddenTabSelector = ".detail-options .hidden-tab";
      var cardinalityTabSelector = ".detail-options .cardinality-tab";
      var suggestionsTabSelector = ".detail-options .value-recommendation-tab";
      var valuesTabSelector = ".detail-options .value-controlled-terms-tab";
      var requiredTabSelector = ".detail-options .required-tab";

      it("should show only the correct tabs", function () {
        expect($(compiledDirective).find(cardinalityTabSelector).length).toBe(0);
        expect($(compiledDirective).find(hiddenTabSelector).length).toBe(0);
        expect($(compiledDirective).find(suggestionsTabSelector).length).toBe(0);
        expect($(compiledDirective).find(valuesTabSelector).length).toBe(0);
        expect($(compiledDirective).find(requiredTabSelector).length).toBe(1);
      });

      it("should have one option by default", function () {
        // Here, the $ symbol enables the use of jQuery's find method. By default Angular uses jqLite, which is limited
        // to find tag names. jQuery's find expressions are much more powerful
        expect($(compiledDirective).find(checkBoxSelector).length).toBe(1);
        // Check the template model
        expect(DataManipulationService.getLiterals($fieldDirectiveScope.field).length).toBe(1);
      });

      it("should add new options when clicking on 'Add another'", function () {
        // Add some additional options
        var newOptionsCount = 3;
        for (var i = 0; i < newOptionsCount; i++) {
          $(compiledDirective).find(addAnotherSelector).click();
        }
        expect($(compiledDirective).find(checkBoxSelector).length).toBe(newOptionsCount + 1);
        // Check the template model
        expect(DataManipulationService.getLiterals($fieldDirectiveScope.field).length).toBe(4);
      });

      it("should allow to set default choices", function () {
        // Check that the default option is initially unselected
        expect($(compiledDirective).find(checkBoxSelector).hasClass(unselectedOptionClass)).toBe(true);
        expect($(compiledDirective).find(checkBoxSelector).hasClass(selectedOptionClass)).toBe(false);
        // Check the template model
        var defaultOption = DataManipulationService.getLiterals($fieldDirectiveScope.field)[0];
        expect(DataManipulationService.isSelectedByDefault(defaultOption)).toBe(false);

        // Select the default option
        $(compiledDirective).find(checkBoxSelector).click();
        // Check that it was correctly selected (UI)
        expect($(compiledDirective).find(checkBoxSelector).hasClass(unselectedOptionClass)).toBe(false);
        expect($(compiledDirective).find(checkBoxSelector).hasClass(selectedOptionClass)).toBe(true);
        // Check that it was correctly selected (template model)
        expect(DataManipulationService.isSelectedByDefault(defaultOption)).toBe(true);

        // Add two more options and set option 3 (index=2) as default
        $(compiledDirective).find(addAnotherSelector).click();
        $(compiledDirective).find(addAnotherSelector).click();
        $(compiledDirective).find(checkBoxSelector)[2].click();
        // Check that now both option 1 and option 3 are selected (UI)
        var selectedOptions = [];
        $(compiledDirective).find(checkBoxSelector).each(function (index) {
          var option = $(compiledDirective).find(checkBoxSelector)[index];
          if ($(option).hasClass(selectedOptionClass) == true) {
            selectedOptions.push(index);
          }
        });
        expect(selectedOptions).toEqual([0, 2]);
        // Check that now both option 1 and option 3 are selected (template model)
        var optionsTemplateModel = DataManipulationService.getLiterals($fieldDirectiveScope.field);
        var selectedOptionsTemplateModel = [];
        for (var i = 0; i < optionsTemplateModel.length; i++) {
          if (DataManipulationService.isSelectedByDefault(optionsTemplateModel[i])) {
            selectedOptionsTemplateModel.push(i);
          }
        }
        expect(selectedOptionsTemplateModel).toEqual([0, 2]);

      });

    };

    function textfieldTests() {

      var hiddenTabSelector = ".detail-options .hidden-tab";
      var cardinalityTabSelector = ".detail-options .cardinality-tab";
      var suggestionsTabSelector = ".detail-options .value-recommendation-tab";
      var valuesTabSelector = ".detail-options .value-controlled-terms-tab";
      var requiredTabSelector = ".detail-options .required-tab";

      it("should show only the correct tabs", function () {
        expect($(compiledDirective).find(cardinalityTabSelector).length).toBe(1);
        expect($(compiledDirective).find(hiddenTabSelector).length).toBe(1);
        expect($(compiledDirective).find(suggestionsTabSelector).length).toBe(1);
        expect($(compiledDirective).find(valuesTabSelector).length).toBe(1);
        expect($(compiledDirective).find(requiredTabSelector).length).toBe(1);
      });
    }

    /* SHARED UTILS DEFINITIONS */

    // Create a field given the field type (e.g. checkbox) and add it to the template
    // Note: make sure your field type is loaded in the karma config before using it
    function addFieldToTemplate(fieldType) {
      var $createTemplateControllerScope = $rootScope.$new(true); // create a new, isolated scope
      // Initialize the CreateTemplateController
      $controller('CreateTemplateController', {
        $rootScope: $rootScope,
        $scope    : $createTemplateControllerScope
      });

      // Define the variables needed to add the field to the template
      createdTemplate = $createTemplateControllerScope.form;
      $fieldDirectiveScope = $rootScope.$new(true) // create a new, isolated scope
      var domId = DataManipulationService.createDomId();
      var callback = function () {
      }; // mock the callback function

      // Create field and add it to the template
      $fieldDirectiveScope.field = StagingService.addFieldToForm(createdTemplate, fieldType, domId, callback);
      fieldId = $fieldDirectiveScope.field['@id'];
      // Compile field directive
      var fieldDirective = "<field-directive nested='false' field='field' model='model'></field-directive>";
      compiledDirective = $compile(fieldDirective)($fieldDirectiveScope);
      // Now run a $digest cycle
      $fieldDirectiveScope.$digest();
    };

    // Create a field given the field type (e.g. checkbox) and add it to the template element
    function addFieldToTemplateElement(fieldType) {
      var $createTemplateElementControllerScope = $rootScope.$new(true) // create a new, isolated scope
      // Initialize the CreateTemplateController
      $controller('CreateElementController', {
        $rootScope: $rootScope,
        $scope    : $createTemplateElementControllerScope
      });

      // Define the variables needed to add the field to the element
      createdTemplateElement = $createTemplateElementControllerScope.element;
      $fieldDirectiveScope = $rootScope.$new(true) // create a new, isolated scope
      var domId = DataManipulationService.createDomId();
      var callback = function () {
      }; // mock the callback function

      // Create field and add it to the template
      $fieldDirectiveScope.field = StagingService.addFieldToElement(createdTemplateElement, fieldType, domId,
          callback);
      fieldId = $fieldDirectiveScope.field['@id'];
      // Compile field directive
      var fieldDirective = "<field-directive nested='false' field='field' model='model'></field-directive>";
      compiledDirective = $compile(fieldDirective)($fieldDirectiveScope);
      // Now run a $digest cycle
      $fieldDirectiveScope.$digest();
    };

  });
});
