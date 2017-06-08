'use strict';

define(['app', 'angular'], function (app) {

  describe('file-upload.directive_test.js:', function () {

    var $rootScope;
    var $compile;
    var $controller; // responsible for instantiating controllers
    var $httpBackend;
    var $templateCache;
    var UIMessageService;

    // Load the module that contains the templates that were loaded with html2js
    beforeEach(module('my.templates'));
    // Load other modules
    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.form.fileUpload'));
    beforeEach(module('cedar.templateEditor.service.uIMessageService'));

    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_, _$templateCache_,
                  _UIMessageService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $compile = _$compile_;
          $controller = _$controller_;
          $httpBackend = _$httpBackend_;
          $templateCache = _$templateCache_;
          UIMessageService = _UIMessageService_;

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

    describe('In a template,', function () {
      describe('a file upload widget', function () {

        var $uploadScope;
        var uploadDirective;
        var fileUploadSelector = ".file-upload";


        beforeEach(function () {
          // create a new, isolated scope and a new directive
          $uploadScope = $rootScope.$new();
          uploadDirective = '<file-upload to="" instance="" ></file-upload>';
          uploadDirective = $compile(uploadDirective)($uploadScope);
          $uploadScope.$digest();
        });

        it("should have a file upload defined by default", function () {
          var elm = uploadDirective[0];
          expect(elm.querySelector('.file-upload.ng-isolate-scope')).toBeDefined();
        });

      });
    });


  });
});
