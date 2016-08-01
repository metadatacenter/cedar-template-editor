'use strict';
var TemplateCreatorPage = require('../pages/template-creator-page.js');
var _ = require('../libs/lodash.min.js');


describe('template-creator', function () {
  // var EC = protractor.ExpectedConditions;
  var page;
  var cssTextField = ".field-root .elementTotalContent .cedar-svg-text";
  var cssTextArea = '.field-root .elementTotalContent .cedar-svg-paragraph';
  var cssRadio = ".field-root .elementTotalContent .cedar-svg-multiple-choice";
  var cssCheckbox = ".field-root .elementTotalContent .cedar-svg-checkbox";
  var cssDate = ".field-root .elementTotalContent .cedar-svg-calendar";
  var cssEmail = ".field-root .elementTotalContent .cedar-svg-at";
  var cssList = ".field-root .elementTotalContent .cedar-svg-list";
  var cssRichText = ".field-root .elementTotalContent .cedar-svg-rich-text";
  var cssNumber = ".field-root .elementTotalContent .cedar-svg-numeric";
  var cssPhoneNumber = ".field-root .elementTotalContent .cedar-svg-phone";
  var cssSectionBreak = ".field-root .elementTotalContent .cedar-svg-section-break";
  var cssImage = ".field-root .elementTotalContent .cedar-svg-image";
  var cssVideo = ".field-root .elementTotalContent .cedar-svg-youtube";

  var cssAddMoreDialog = ".other-elements";
  var cssFieldTitle = '.form-group  input .form-control';
  var cssFieldDescription = '.field-description-definition';
  var cssFieldRoot = ".field-root";
  var cssDetailOptions = ".detail-options";
  var cssFieldContainer = ".field-root .elementTotalContent";
  var modelFieldTitle = '$root.schemaOf(field)._ui.title';
  var modelFieldDescription = '$root.schemaOf(field)._ui.description';


  var fieldTypes = [
    {
      "cedarType"         : "textfield",
      "iconClass"         : "cedar-svg-text",
      "label"             : "Text",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "textarea",
      "iconClass"         : "cedar-svg-paragraph",
      "label"             : "Paragraph",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "radio",
      "iconClass"         : "cedar-svg-multiple-choice",
      "label"             : "Multiple Choice",
      "allowedInElement"  : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "checkbox",
      "iconClass"         : "cedar-svg-checkbox",
      "label"             : "Checkbox",
      "allowedInElement"  : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "date",
      "iconClass"         : "cedar-svg-calendar",
      "label"             : "Date",
      "allowedInElement"  : true,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "email",
      "iconClass"         : "cedar-svg-at",
      "primaryField"      : true,
      "label"             : "Email",
      "allowedInElement"  : true,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "list",
      "iconClass"         : "cedar-svg-list",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "label"             : "List",
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "numeric",
      "iconClass"         : "cedar-svg-numeric",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "Label"             : "Number",
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "phone-number",
      "iconClass"         : "cedar-svg-phone",
      "allowedInElement"  : true,
      "label"             : "Phone Number",
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "section-break",
      "iconClass"         : "cedar-svg-section-break",
      "allowedInElement"  : true,
      "label"             : "Section Break",
      "hasControlledTerms": false,
      "staticField"       : true
    },
    {
      "cedarType"         : "richtext",
      "iconClass"         : "cedar-svg-rich-text",
      "allowedInElement"  : true,
      "label"             : "Rich Text",
      "hasControlledTerms": false,
      "staticField"       : true
    },
    {
      "cedarType"         : "image",
      "iconClass"         : "cedar-svg-image",
      "allowedInElement"  : true,
      "label"             : "Image",
      "hasControlledTerms": false,
      "staticField"       : true
    },
    {
      "cedarType"         : "youtube",
      "iconClass"         : "cedar-svg-youtube",
      "allowedInElement"  : true,
      "label"             : "YouTube Video",
      "hasControlledTerms": false,
      "staticField"       : true
    }
  ];


  beforeEach(function () {
    page = new TemplateCreatorPage();
    page.get();
    page.createTemplate();
    browser.driver.manage().window().maximize();
  });


  for (var i = 0; i < fieldTypes.length; i++) {

    (function (fieldType) {

      // github issue #401 part 1 of 2: create, edit, and delete fields
      it("should create, edit, and delete a " + fieldType.cedarType, function () {

        var cssField = cssFieldContainer + ' .' + fieldType.iconClass;

        page.addField(fieldType.cedarType);
        // is the field there?
        var field = element(by.css(cssField));
        expect(field.isPresent()).toBe(true);
        // does it have a title and in edit mode?
        expect(element(by.model(modelFieldTitle)).isPresent()).toBe(true);
        // does it have the help text field in edit mode?
        expect(element(by.model(modelFieldDescription)).isPresent()).toBe(true);
        page.removeField();
        // is it removed?
        expect(element(by.css(cssField)).isPresent()).toBe(false);

      });

      // github issue #401 part 2 of 2:  select and deselect fields
      it("should select and deselect a " + fieldType.cedarType, function () {

        var firstField;
        var lastField;

        // add two fields
        page.addField(fieldType.cedarType);
        page.addField(fieldType.cedarType);

        // do we have two fields?
        var fields = element.all(by.css(cssFieldRoot));
        expect(fields.count()).toBe(2);

        firstField = fields.first();
        lastField = fields.last();

        // do we have two fields
        expect(firstField.isPresent()).toBe(true);
        expect(lastField.isPresent()).toBe(true);

        // is the second field selected and not the first
        expect(lastField.element(by.model(modelFieldTitle)).isPresent()).toBe(true);
        expect(firstField.element(by.model(modelFieldTitle)).isPresent()).toBe(false);

        // click on the first field
        browser.actions().mouseMove(firstField).perform();
        firstField.click();

        // is the first selected and the second deselected
        expect(firstField.element(by.model(modelFieldTitle)).isPresent()).toBe(true);
        expect(lastField.element(by.model(modelFieldTitle)).isPresent()).toBe(false);
      });

    })(fieldTypes[i]);

  }


  //it("Should not set maxItems if maxItems is N", function () {
  //  element(by.css("#element-name")).sendKeys("1 - N text field");
  //  element(by.css("#element-description")).sendKeys("Text field was created via Selenium");
  //  page.addTextField.then(function () {
  //    element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function () {
  //      element(by.css("#cardinality-options .max-items-option .filter-option")).click().then(function () {
  //        element(by.css("#cardinality-options .max-items-option .dropdown-menu li:nth-child(9) a")).click().then(function () {
  //          element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function (text) {
  //            expect(text).toBe("N")
  //          });
  //        });
  //      });
  //      element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
  //      element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");
  //      browser.waitForAngular().then(function () {
  //        element(by.css(".save-options .add")).click().then(function () {
  //          element.all(by.css("form.form-preview input[type='text']")).then(function (items) {
  //            expect(items.length).toBe(1);
  //          });
  //          expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(true);
  //          element(by.css(".clear-save .btn-save")).click().then(function () {
  //            browser.waitForAngular().then(function () {
  //              page.getJsonPreviewText.then(function (value) {
  //                var json = JSON.parse(value);
  //                expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == 1).toBe(true);
  //                expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
  //              });
  //            });
  //          });
  //        });
  //      });
  //    });
  //  });
  //});
  //it("Should not set minItems & maxItems if cardinality is 1 - 1", function () {
  //  element(by.css("#element-name")).sendKeys("1 - 1 text field");
  //  element(by.css("#element-description")).sendKeys("Text field was created via Selenium");
  //  page.addTextField.then(function () {
  //    element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function () {
  //      element(by.css("#cardinality-options .min-items-option .filter-option")).getText().then(function (text) {
  //        expect(text).toBe("1");
  //      });
  //      element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function (text) {
  //        expect(text).toBe("1")
  //      });
  //      element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
  //      element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");
  //      browser.waitForAngular().then(function () {
  //        element(by.css(".save-options .add")).click().then(function () {
  //          element.all(by.css("form.form-preview input[type='text']")).then(function (items) {
  //            expect(items.length).toBe(1);
  //          });
  //          expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(false);
  //          element(by.css(".clear-save .btn-save")).click().then(function () {
  //            browser.waitForAngular().then(function () {
  //              page.getJsonPreviewText.then(function (value) {
  //                var json = JSON.parse(value);
  //                expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == undefined).toBe(true);
  //                expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
  //              });
  //            });
  //          });
  //        });
  //      });
  //    });
  //  });
  //});
}); 
