 'use strict';

 define(['app', 'angular'], function (app) {
  describe("getRichTextConfigService", function() {
    var richTextConfigService;
    var $rootScope;
    var $httpBackend;


    beforeEach(module('my.templates'));
    // Load other modules
    beforeEach(module(app.name));
    beforeEach(module(app.name));
    beforeEach(module('cedar.templateEditor.service.richTextConfigService'));


    beforeEach(inject(
        function (_$rootScope_, _$compile_, _$controller_, _$httpBackend_, _$templateCache_,
                  _RichTextConfigService_) {
          $rootScope = _$rootScope_.$new(); // create new scope
          $httpBackend = _$httpBackend_;
          richTextConfigService = _RichTextConfigService_;
        }));

    beforeEach(function () {
      // returns the appropriate file content when requested
      $httpBackend.whenGET('config/src/rich-text-config-service.conf.json').respond(function (method, url, data) {
        var request = new XMLHttpRequest();
        request.open('GET', 'config/src/rich-text-config-service.conf.json', false);
        request.send(null);
        return [request.status, request.response, {}];
      });
    });

   var config = {
      "default": {
        "toolbar": "full",
        "toolbar_full": [
          {
            "name": "basicstyles",
            "items": [
              "Bold",
              "Italic",
              "Strike",
              "Underline"
            ]
          },
          {
            "name": "paragraph",
            "items": [
              "BulletedList",
              "NumberedList",
              "Blockquote"
            ]
          },
          {
            "name": "editing",
            "items": [
              "JustifyLeft",
              "JustifyCenter",
              "JustifyRight",
              "JustifyBlock"
            ]
          },
          {
            "name": "links",
            "items": [
              "Link",
              "Unlink",
              "Anchor"
            ]
          },
          {
            "name": "tools",
            "items": [
              "SpellChecker",
              "Maximize"
            ]
          },
          "/",
          {
            "name": "styles",
            "items": [
              "Format",
              "FontSize",
              "TextColor",
              "PasteText",
              "PasteFromWord",
              "RemoveFormat"
            ]
          },
          {
            "name": "insert",
            "items": [
              "Image",
              "Table",
              "SpecialChar"
            ]
          },
          {
            "name": "forms",
            "items": [
              "Outdent",
              "Indent"
            ]
          },
          {
            "name": "clipboard",
            "items": [
              "Undo",
              "Redo"
            ]
          },
          {
            "name": "document",
            "items": [
              "PageBreak",
              "Source"
            ]
          }
        ],
        "disableNativeSpellChecker": false,
        "uiColor": "#FAFAFA",
        "height": "200px",
        "width": "100%",
        "language": "en"
      }
    };

    it("returns the default config again", function() {

        richTextConfigService.init();
        expect(richTextConfigService.getConfig("default")).toEqual(config["default"]);

    });
  });

});
