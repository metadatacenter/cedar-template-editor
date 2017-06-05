'use strict';

define(['app', 'angular'], function (app) {

  describe('cedar-template-element.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller; // responsible for instantiating controllers
    var $httpBackend;
    var $templateCache;
    var $timeout;


    var DataManipulationService;
    var StagingService;
    var TemplateElementService;
    var DataUtilService;
    var SpreadsheetService;
    var UIUtilService;


    var createdTemplate;
    var createdModel;
    var createdTemplateElement;


    // Load the module that contains the templates that were loaded with html2js
    beforeEach(module('my.templates'));
    // Load other modules
    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.template.createTemplateController'));
    beforeEach(module('cedar.templateEditor.templateElement.createElementController'));
    beforeEach(module('cedar.templateEditor.templateElement.cedarTemplateElementDirective'));
    beforeEach(module('cedar.templateEditor.form.fieldCreate.cardinalitySelector'));
    beforeEach(module('cedar.templateEditor.form.fieldDirective'));
    beforeEach(module('cedar.templateEditor.service.stagingService'));
    beforeEach(module('cedar.templateEditor.service.dataManipulationService'));
    beforeEach(module('cedar.templateEditor.service.dataUtilService'));
    beforeEach(module('cedar.templateEditor.form.spreadsheetService'));
    beforeEach(module('cedar.templateEditor.service.uIUtilService'));
    beforeEach(module('cedar.templateEditor.service.templateElementService'));


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
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_, _$templateCache_, _$timeout_,
                  _StagingService_, _DataManipulationService_, _DataUtilService_, _SpreadsheetService_, _UIUtilService_,
                  _TemplateElementService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          $templateCache = _$templateCache_;
          $timeout = _$timeout_;

          StagingService = _StagingService_;
          DataManipulationService = _DataManipulationService_;
          DataUtilService = _DataUtilService_;
          SpreadsheetService = _SpreadsheetService_;
          UIUtilService = _UIUtilService_;
          TemplateElementService = _TemplateElementService_;

        }));

    beforeEach(function () {
      // returns the appropriate file content when requested
      $httpBackend.whenGET('resources/i18n/locale-en.json').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'resources/i18n/locale-en.json', false);
        request.send(null);
        return [request.status, request.response, {}];
      });

      // returns the appropriate file content when requested
      $httpBackend.whenGET('scripts/form/field-create/cardinality-selector.directive.html').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'scripts/form/field-create/cardinality-selector.directive.html', false);
        request.send(null);
        return [request.status, request.response, {}];
      });

      $httpBackend.whenGET(
          'https://resource.metadatacenter.orgx/template-elements/https%3A%2F%2Frepo.metadatacenter.orgx%2Ftemplate-elements%2F7ce9f613-ff0b-427b-a007-4d3b0cbe1fbb').respond(
          function (method, url, data) {
            var data = {
              "@id"                 : "https://repo.metadatacenter.orgx/template-elements/7ce9f613-ff0b-427b-a007-4d3b0cbe1fbb",
              "@type"               : "https://schema.metadatacenter.org/core/TemplateElement",
              "@context"            : {
                "xsd"              : "http://www.w3.org/2001/XMLSchema#",
                "pav"              : "http://purl.org/pav/",
                "oslc"             : "http://open-services.net/ns/core#",
                "schema"           : "http://schema.org/",
                "pav:createdOn"    : {
                  "@type": "xsd:dateTime"
                },
                "pav:createdBy"    : {
                  "@type": "@id"
                },
                "pav:lastUpdatedOn": {
                  "@type": "xsd:dateTime"
                },
                "oslc:modifiedBy"  : {
                  "@type": "@id"
                }
              },
              "type"                : "object",
              "title"               : "Test element schema",
              "description"         : "Test element schema autogenerated by the CEDAR Template Editor 1.0.7-SNAPSHOT",
              "_ui"                 : {
                "title"         : "test",
                "description"   : "Description",
                "order"         : [],
                "propertyLabels": {}
              },
              "properties"          : {
                "@context"         : {
                  "type"                : "object",
                  "properties"          : {
                    "pav" : {
                      "type"  : "string",
                      "format": "uri",
                      "enum"  : [
                        "http://purl.org/pav/"
                      ]
                    },
                    "oslc": {
                      "type"  : "string",
                      "format": "uri",
                      "enum"  : [
                        "http://open-services.net/ns/core#"
                      ]
                    }
                  },
                  "patternProperties"   : {
                    "^(?!pav)(?!schema)(?!oslc)[a-zA-Z][a-zA-Z0-9]*$": {
                      "type"  : "string",
                      "format": "uri"
                    }
                  },
                  "required"            : [],
                  "additionalProperties": false
                },
                "@id"              : {
                  "type"  : [
                    "string",
                    "null"
                  ],
                  "format": "uri"
                },
                "@type"            : {
                  "oneOf": [
                    {
                      "type"  : "string",
                      "format": "uri"
                    },
                    {
                      "type"       : "array",
                      "minItems"   : 1,
                      "items"      : {
                        "type"  : "string",
                        "format": "uri"
                      },
                      "uniqueItems": true
                    }
                  ]
                },
                "pav:createdOn"    : {
                  "type"  : [
                    "string",
                    "null"
                  ],
                  "format": "date-time"
                },
                "pav:createdBy"    : {
                  "type"  : [
                    "string",
                    "null"
                  ],
                  "format": "uri"
                },
                "pav:lastUpdatedOn": {
                  "type"  : [
                    "string",
                    "null"
                  ],
                  "format": "date-time"
                },
                "oslc:modifiedBy"  : {
                  "type"  : [
                    "string",
                    "null"
                  ],
                  "format": "uri"
                }
              },
              "required"            : [
                "@context"
              ],
              "pav:createdOn"       : "2017-05-30T14:15:52-0700",
              "pav:createdBy"       : "https://metadatacenter.org/users/287aef81-b87c-4278-9c40-5f3d464c5b30",
              "pav:lastUpdatedOn"   : "2017-05-30T14:15:52-0700",
              "oslc:modifiedBy"     : "https://metadatacenter.org/users/287aef81-b87c-4278-9c40-5f3d464c5b30",
              "schema:schemaVersion": "1.1.0",
              "additionalProperties": false,
              "$schema"             : "http://json-schema.org/draft-04/schema#"
            };
            var newElement = angular.fromJson(data);
            return [200, data, {}];
          });


    });


    // add an element to a template, then test
    describe('In a template,', function () {
      describe(' add an element', function () {

        var $cedarTemplateElementScope;
        var $createTemplateControllerScope;
        var cedarTemplateElementDirective;
        var compiledDirective;
        var clonedElement;
        var elementNameLabelSelector = "p.element-name-label input";

        beforeEach(function () {

          // create a templateController scope
          $createTemplateControllerScope = $rootScope.$new(true);
          // Initialize the CreateTemplateController
          $controller('CreateTemplateController', {
            $rootScope: $rootScope,
            $scope    : $createTemplateControllerScope
          });

          // create a templateElement scope
          $cedarTemplateElementScope = $rootScope.$new(true);
          var domId = DataManipulationService.createDomId();
          var callback = function () {
          };

          // Create an element and add it to the template
          clonedElement = {
            "@id"                 : "https://repo.metadatacenter.orgx/template-elements/7ce9f613-ff0b-427b-a007-4d3b0cbe1fbb",
            "@type"               : "https://schema.metadatacenter.org/core/TemplateElement",
            "@context"            : {
              "xsd"              : "http://www.w3.org/2001/XMLSchema#",
              "pav"              : "http://purl.org/pav/",
              "oslc"             : "http://open-services.net/ns/core#",
              "schema"           : "http://schema.org/",
              "pav:createdOn"    : {
                "@type": "xsd:dateTime"
              },
              "pav:createdBy"    : {
                "@type": "@id"
              },
              "pav:lastUpdatedOn": {
                "@type": "xsd:dateTime"
              },
              "oslc:modifiedBy"  : {
                "@type": "@id"
              }
            },
            "type"                : "object",
            "title"               : "Test element schema",
            "description"         : "Test element schema autogenerated by the CEDAR Template Editor 1.0.7-SNAPSHOT",
            "_ui"                 : {
              "title"         : "test",
              "description"   : "Description",
              "order"         : [],
              "propertyLabels": {}
            },
            "properties"          : {
              "@context"         : {
                "type"                : "object",
                "properties"          : {
                  "pav" : {
                    "type"  : "string",
                    "format": "uri",
                    "enum"  : [
                      "http://purl.org/pav/"
                    ]
                  },
                  "oslc": {
                    "type"  : "string",
                    "format": "uri",
                    "enum"  : [
                      "http://open-services.net/ns/core#"
                    ]
                  }
                },
                "patternProperties"   : {
                  "^(?!pav)(?!schema)(?!oslc)[a-zA-Z][a-zA-Z0-9]*$": {
                    "type"  : "string",
                    "format": "uri"
                  }
                },
                "required"            : [],
                "additionalProperties": false
              },
              "@id"              : {
                "type"  : [
                  "string",
                  "null"
                ],
                "format": "uri"
              },
              "@type"            : {
                "oneOf": [
                  {
                    "type"  : "string",
                    "format": "uri"
                  },
                  {
                    "type"       : "array",
                    "minItems"   : 1,
                    "items"      : {
                      "type"  : "string",
                      "format": "uri"
                    },
                    "uniqueItems": true
                  }
                ]
              },
              "pav:createdOn"    : {
                "type"  : [
                  "string",
                  "null"
                ],
                "format": "date-time"
              },
              "pav:createdBy"    : {
                "type"  : [
                  "string",
                  "null"
                ],
                "format": "uri"
              },
              "pav:lastUpdatedOn": {
                "type"  : [
                  "string",
                  "null"
                ],
                "format": "date-time"
              },
              "oslc:modifiedBy"  : {
                "type"  : [
                  "string",
                  "null"
                ],
                "format": "uri"
              }
            },
            "required"            : [
              "@context"
            ],
            "pav:createdOn"       : "2017-05-30T14:15:52-0700",
            "pav:createdBy"       : "https://metadatacenter.org/users/287aef81-b87c-4278-9c40-5f3d464c5b30",
            "pav:lastUpdatedOn"   : "2017-05-30T14:15:52-0700",
            "oslc:modifiedBy"     : "https://metadatacenter.org/users/287aef81-b87c-4278-9c40-5f3d464c5b30",
            "schema:schemaVersion": "1.1.0",
            "additionalProperties": false,
            "$schema"             : "http://json-schema.org/draft-04/schema#"
          };
          var elementId = "https://repo.metadatacenter.orgx/template-elements/7ce9f613-ff0b-427b-a007-4d3b0cbe1fbb";
          $cedarTemplateElementScope.element = StagingService.addClonedElementToForm(
              $createTemplateControllerScope.form, elementId, clonedElement, domId, callback);


          // Compile element directive
          cedarTemplateElementDirective = "<cedar-template-element  key='key' element='element' model='model'  parent-element='parentElement' > </cedar-template-element>";
          $cedarTemplateElementScope.key = 'test';
          $cedarTemplateElementScope.parentElement = $createTemplateControllerScope.form;
          $cedarTemplateElementScope.element = clonedElement;
          $cedarTemplateElementScope.model = null;
          compiledDirective = $compile(cedarTemplateElementDirective)($cedarTemplateElementScope);
          $cedarTemplateElementScope.$digest();

        });

        it("should accept and retain new property value ", function () {
          var value = 'some text';
          var key = 'someText';

          // should have an element-name-label
          var elm = compiledDirective[0];
          var name = elm.querySelector('p.element-name-label input');
          var nameElm = angular.element(name);
          nameElm.triggerHandler('click');
          nameElm.val(value);
          nameElm.triggerHandler('change');
          $timeout.flush();

          // check an object's value for a key
          function hasValue(obj, key, value) {
            return obj.hasOwnProperty(key) && obj[key] === value;
          }

          // does it have the new value in the property labels?
          var test = [];
          test.push($cedarTemplateElementScope.parentElement["_ui"]["propertyLabels"]);
          expect(test.some(function (propertyLabels) {
            return hasValue(propertyLabels, key, value);
          })).toEqual(true);
        });

        it("should switch between expanded and paged views", function () {



          // first just try to set this element multiple
          var elm = compiledDirective[0];
          var multiple = elm.querySelector('.detail-options');
          var multipleElm = angular.element(multiple);
          multipleElm.triggerHandler('click');

          var noActiveBefore = elm.querySelector('.d-option.clear-value.active');
          var yesActiveBefore = elm.querySelector('.d-option.set-value.active');
          expect(noActiveBefore == null).toBe(false);
          expect(yesActiveBefore == null).toBe(true);


          $cedarTemplateElementScope.$apply();
          $cedarTemplateElementScope.$digest();

          var yesOption = elm.querySelector('#cardinality-options .set-value');
          var yesElm = angular.element(yesOption);
          yesElm.triggerHandler('click');

          var noActiveAfter = elm.querySelector('.d-option.clear-value.active');
          var yesActiveAfter = elm.querySelector('.d-option.set-value.active');
          expect(noActiveAfter == null).toBe(true);
          expect(yesActiveAfter == null).toBe(false);


          //
          // expect( $(compiledDirective).find('div.d-option.set-value.active')).toBeDefined();
          // expect($(compiledDirective).find('div.d-option.set-value.active').is(':visible')).toBe(false);
          // expect( $(compiledDirective).find('div.d-option.clear-value.active')).toBeDefined();
          // expect($(compiledDirective).find('div.d-option.clear-value.active').is(':visible')).toBe(true);
          //
          //
          //
          // var options = elm.querySelectorAll('#cardinality-options .type-toggle .d-option');
          // console.log(options[1]);
          //
          // var yesOption = angular.element(options[1]);
          // console.log(yesOption);
          //yesOption.trigger('click');


        });

        it("should create element instance when min cardinality is 0", function () {

          //element(by.css('[ng-click="myFunction()"]'))
        });


      });
    });


  });
});
