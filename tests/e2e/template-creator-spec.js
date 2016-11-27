'use strict';
var TemplatePage = require('../pages/template-creator-page.js');
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyPage = require('../pages/toasty-page.js');


var _ = require('../libs/lodash.min.js');


describe('template-creator', function () {
  var EC = protractor.ExpectedConditions;
  var page;
  var workspacePage;
  var toastyPage;

  var cleanJson;
  var dirtyJson;
  var sampleTitle;
  var sampleDescription;
  var sampleUrl;
  var sampleJson;

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
      "primaryField"      : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "checkbox",
      "iconClass"         : "cedar-svg-checkbox",
      "label"             : "Checkbox",
      "allowedInElement"  : true,
      "primaryField"      : true,
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "date",
      "iconClass"         : "cedar-svg-calendar",
      "label"             : "Date",
      "allowedInElement"  : true,
      "primaryField"      : false,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "email",
      "iconClass"         : "cedar-svg-at",
      "label"             : "Email",
      "allowedInElement"  : true,
      "primaryField"      : false,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "list",
      "iconClass"         : "cedar-svg-list",
      "allowedInElement"  : true,
      "primaryField"      : false,
      "label"             : "List",
      "hasControlledTerms": true,
      "staticField"       : false
    },
    {
      "cedarType"         : "numeric",
      "iconClass"         : "cedar-svg-numeric",
      "allowedInElement"  : true,
      "primaryField"      : false,
      "label"             : "Number",
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "phone-number",
      "iconClass"         : "cedar-svg-phone",
      "allowedInElement"  : true,
      "label"             : "Phone Number",
      "primaryField"      : false,
      "hasControlledTerms": false,
      "staticField"       : false
    },
    {
      "cedarType"         : "section-break",
      "iconClass"         : "cedar-svg-section-break",
      "allowedInElement"  : true,
      "label"             : "Section Break",
      "hasControlledTerms": false,
      "primaryField"      : false,
      "staticField"       : true
    },
    {
      "cedarType"         : "richtext",
      "iconClass"         : "cedar-svg-rich-text",
      "allowedInElement"  : true,
      "label"             : "Rich Text",
      "hasControlledTerms": false,
      "primaryField"      : false,
      "staticField"       : true
    },
    {
      "cedarType"         : "image",
      "iconClass"         : "cedar-svg-image",
      "allowedInElement"  : true,
      "label"             : "Image",
      "hasControlledTerms": false,
      "primaryField"      : false,
      "staticField"       : true
    },
    {
      "cedarType"         : "youtube",
      "iconClass"         : "cedar-svg-youtube",
      "allowedInElement"  : true,
      "label"             : "YouTube Video",
      "primaryField"      : false,
      "hasControlledTerms": false,
      "staticField"       : true
    }
  ];
  var fieldType = fieldTypes[0];
  var field = element(by.css('.field-root .' + fieldType.iconClass));
  var type = fieldType.cedarType;
  var isMore = !fieldType.primaryField;
  var title = fieldType.label;
  var description = fieldType.label + ' description';

  var pageNames = ['template', 'element'];


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {

    workspacePage = WorkspacePage;
    page = TemplatePage;
    toastyPage = ToastyPage;
    browser.driver.manage().window().maximize();
    workspacePage.get();
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
    browser.ignoreSynchronization = null;

  });

  afterEach(function () {

    browser.ignoreSynchronization = true;

  });

  for (var j = 0; j < pageNames.length; j++) {
    (function (pageName) {

      it("should create the sample ", function () {

        sampleTitle = pageName + page.getRandomInt(1, 99999999);
        sampleDescription = description + page.getRandomInt(1, 99999999);
        page.createPage(pageName, sampleTitle, sampleDescription);
        page.clickSave(pageName);

        toastyPage.isToastyNew();

        // get the url of this element
        //browser.getCurrentUrl().then(function (value) {
        //  sampleUrl = value;
        //  // TODO: can't reliable load from url later using browser.get(sampleUrl)
        //});

      });

      it("should have editable title", function () {

        workspacePage.openResource(pageName, sampleTitle);
        page.isTitle(pageName, sampleTitle);

      });

      it("should have editable description", function () {

        workspacePage.openResource(pageName, sampleTitle);
        page.isDescription(pageName, sampleDescription);

      });

      it("should delete the sample from the workspace, ", function () {
        workspacePage.deleteResourceNew(sampleTitle, pageName);
      });

      xit("should delete any resource from the workspace, ", function () {
        workspacePage.deleteResourceNew('*', pageName);
      });


      // for each field type
      //for (var k = 0; k < 0; k++) {
      for (var k = 0; k < fieldTypes.length; k++) {
        (function (fieldType) {

          var field = element(by.css('.field-root .' + fieldType.iconClass));
          var type = fieldType.cedarType;
          var isMore = !fieldType.primaryField;
          var title = fieldType.label;
          var description = fieldType.label + ' description';

          it("should add and delete a " + fieldType.cedarType, function () {

            page.createPage(pageName);

            // create the field
            page.addFieldNew(type, isMore, title, description);
            browser.wait(EC.presenceOf(field));

            // delete the field
            browser.actions().mouseMove(field).perform();
            browser.wait(EC.elementToBeClickable(page.removeFieldButton()));
            page.removeFieldButton().click();
            browser.wait(EC.not(EC.presenceOf(field)));

          });

          it("should select and deselect a " + fieldType.cedarType, function () {

            var firstField;
            var lastField;

            page.createPage(pageName);

            // add two fields
            page.addFieldNew(fieldType.cedarType, isMore, title, description);
            page.addFieldNew(fieldType.cedarType, isMore, title, description);

            // do we have two fields
            var fields = element.all(by.css(page.cssFieldRoot));
            expect(fields.count()).toBe(2);

            firstField = fields.first();
            lastField = fields.last();

            // do we have each field
            expect(firstField.isPresent()).toBe(true);
            expect(lastField.isPresent()).toBe(true);

            // is the second field selected and not the first
            expect(lastField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(true);
            expect(firstField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(false);

            // click on the first field
            browser.actions().mouseMove(firstField).perform();
            browser.wait(EC.elementToBeClickable(firstField));
            firstField.click();

            // is the first selected and the second deselected
            expect(firstField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(true);
            expect(lastField.element(by.model(page.modelFieldTitle)).isPresent()).toBe(false);

          });

        })
        (fieldTypes[k]);
      }

      it("should hang on to the sample template json", function () {

        page.createPage(pageName);

        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        browser.wait(EC.visibilityOf(page.showJsonLink()));
        expect(page.templateJSON().isDisplayed()).toBe(true);

        // get the dirty template
        browser.wait(EC.visibilityOf(page.jsonPreview()));

        page.jsonPreview().getText().then(function (value) {
          sampleJson = JSON.parse(value);
        });
      });

      it("should should restore the template when clear is clicked and confirmed", function () {

        page.createPage(pageName);

        // add two fields
        page.addFieldNew(fieldType.cedarType, isMore, title, description);
        page.addFieldNew(fieldType.cedarType, isMore, title, description);

        page.clickClear(pageName);

        browser.wait(EC.visibilityOf(page.createConfirmationDialog()));
        expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
        expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');

        // expect confirm to clear the template
        browser.wait(EC.elementToBeClickable(page.createSweetAlertConfirmButton()));
        page.createSweetAlertConfirmButton().click();

        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        browser.wait(EC.presenceOf(page.templateJSON()));
        expect(page.templateJSON().isDisplayed()).toBe(true);

        // get the dirty template json
        page.jsonPreview().getText().then(function (value) {
          var currentJson = JSON.parse(value);
          //expect(_.isEqual(currentJson, sampleJson)).toBe(true);
        });
      });

      it("should show and hide the JSON preview ", function () {

        page.createPage(pageName);

        browser.wait(EC.invisibilityOf(page.templateJSON()));
        expect(page.templateJSON().isDisplayed()).toBe(false);

        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        browser.wait(EC.visibilityOf(page.templateJSON()));
        expect(page.templateJSON().isDisplayed()).toBe(true);

        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        browser.wait(EC.invisibilityOf(page.templateJSON()));
        expect(page.templateJSON().isDisplayed()).toBe(false);

      });

      it("should have the correct json for an empty template", function () {

        page.createPage(pageName);

        expect(page.templateJSON().isDisplayed()).toBe(false);

        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        browser.wait(EC.visibilityOf(page.jsonPreview()));
        page.jsonPreview().getText().then(function (value) {

          // hang on to this json for use later
          cleanJson = JSON.parse(value);
          if (pageName === 'template') {
            expect(_.isEqual(cleanJson, page.emptyTemplateJson)).toBe(true);
          } else {
            expect(_.isEqual(cleanJson, page.emptyElementJson)).toBe(true);
          }
        });
      });

      it("should have the correct json for a clean template", function () {

        page.createPage(pageName);

        // add two fields
        page.addFieldNew(fieldType.cedarType, isMore, title, description);
        page.addFieldNew(fieldType.cedarType, isMore, title, description);

        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        // get the dirty template
        browser.wait(EC.visibilityOf(page.jsonPreview()));
        page.jsonPreview().getText().then(function (value) {

          dirtyJson = JSON.parse(value);
          if (pageName === 'template') {
            expect(_.isEqual(page.emptyTemplateJson, dirtyJson)).toBe(false);
          } else {
            expect(_.isEqual(page.emptyElementJson, dirtyJson)).toBe(false);
          }


        });
      });

      it("should have clear displayed if template is dirty", function () {

        page.createPage(pageName);

        // add two fields
        page.addFieldNew(type, isMore, title, description);
        page.addFieldNew(type, isMore, title, description);

        page.clickClear(pageName);

      });

      it("should change the json preview  when the template changes", function () {

        page.createPage(pageName);

        // add two fields
        page.addFieldNew(type, isMore, title, description);
        page.addFieldNew(type, isMore, title, description);

        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        browser.wait(EC.visibilityOf(page.jsonPreview()));
        page.jsonPreview().getText().then(function (value) {

          dirtyJson = JSON.parse(value);
          if (pageName === 'template') {
            expect(_.isEqual(page.emptyTemplateJson, dirtyJson)).toBe(false);
          } else {
            expect(_.isEqual(page.emptyElementJson, dirtyJson)).toBe(false);
          }

        });
      });

      it("should show template header ", function () {

        page.createPage(pageName);
        browser.wait(EC.visibilityOf(page.topNavigation()));
        expect(page.hasClass(page.topNavigation(), pageName)).toBe(true);
        browser.wait(EC.visibilityOf(page.topNavBackArrow()));
        browser.wait(EC.visibilityOf(page.showJsonLink()));

      });

      // TODO failing test
      xit("should have cancel button present and active", function () {

        page.createPage(pageName);
        page.addFieldNew(type, isMore, title, description);
        page.confirmCancel(pageName);

      });

      it("should not have clear displayed if template is clean", function () {

        page.createPage(pageName);

        if (pageName === 'template') {
          browser.wait(EC.invisibilityOf(page.createClearTemplateButton()));
        } else {
          browser.wait(EC.invisibilityOf(page.createClearElementButton()));
        }

      });

      it("should go to workspace when back arrow clicked", function () {

        page.createPage(pageName);

        browser.wait(EC.elementToBeClickable(page.topNavBackArrow()));
        page.topNavBackArrow().click();

        browser.wait(EC.visibilityOf(workspacePage.createPageName()));

      });

      it("should not change the template when cleared and cancelled", function () {

        page.createPage(pageName);

        // add two fields
        page.addFieldNew(type, isMore, title, description);
        page.addFieldNew(type, isMore, title, description);


        browser.wait(EC.elementToBeClickable(page.showJsonLink()));
        page.showJsonLink().click();

        browser.wait(EC.visibilityOf(page.jsonPreview()));
        page.jsonPreview().getText().then(function (value) {
          var beforeJson = JSON.parse(value);

          page.clickClear(pageName);

          browser.wait(EC.presenceOf(page.createConfirmationDialog()));
          expect(page.createConfirmationDialog().getAttribute(page.sweetAlertCancelAttribute())).toBe('true');
          expect(page.createConfirmationDialog().getAttribute(page.sweetAlertConfirmAttribute())).toBe('true');

          browser.wait(EC.elementToBeClickable(page.createSweetAlertCancelButton()));
          page.createSweetAlertCancelButton().click();

          browser.wait(EC.visibilityOf(page.jsonPreview()));

          page.jsonPreview().getText().then(function (value) {
            var afterJson = JSON.parse(value);
            expect(_.isEqual(beforeJson, afterJson)).toBe(true);
          });
        });
      });

      // TODO needs to be rewritten
      xit("Should not set maxItems if maxItems is N", function () {
        element(by.css("#element-name")).sendKeys("1 - N text field");
        element(by.css("#element-description")).sendKeys("Text field was created via Selenium");
        page.addTextField.then(function () {
          element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function () {
            element(by.css("#cardinality-options .max-items-option .filter-option")).click().then(function () {
              element(by.css("#cardinality-options .max-items-option .dropdown-menu li:nth-child(9) a")).click().then(function () {
                element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function (text) {
                  expect(text).toBe("N")
                });
              });
            });
            element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
            element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");
            browser.waitForAngular().then(function () {
              element(by.css(".save-options .add")).click().then(function () {
                element.all(by.css("form.form-preview input[type='text']")).then(function (items) {
                  expect(items.length).toBe(1);
                });
                expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(true);
                element(by.css(".clear-save .btn-save")).click().then(function () {
                  browser.waitForAngular().then(function () {
                    page.getJsonPreviewText.then(function (value) {
                      var json = JSON.parse(value);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == 1).toBe(true);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
                    });
                  });
                });
              });
            });
          });
        });
      });

      // TODO needs to be rewritten

      xit("Should not set minItems & maxItems if cardinality is 1 - 1", function () {
        element(by.css("#element-name")).sendKeys("1 - 1 text field");
        element(by.css("#element-description")).sendKeys("Text field was created via Selenium");
        page.addTextField.then(function () {
          element(by.css(".checkbox-cardinality input[type='checkbox']")).click().then(function () {
            element(by.css("#cardinality-options .min-items-option .filter-option")).getText().then(function (text) {
              expect(text).toBe("1");
            });
            element(by.css("#cardinality-options .max-items-option .filter-option")).getText().then(function (text) {
              expect(text).toBe("1")
            });
            element(by.css("#form-item-config-section .field-title-definition")).sendKeys("Text field title");
            element(by.css("#form-item-config-section .field-description-definition")).sendKeys("Simple text field created via Selenium");
            browser.waitForAngular().then(function () {
              element(by.css(".save-options .add")).click().then(function () {
                element.all(by.css("form.form-preview input[type='text']")).then(function (items) {
                  expect(items.length).toBe(1);
                });
                expect(element(by.css(".more-input-buttons .add")).isPresent()).toBe(false);
                element(by.css(".clear-save .btn-save")).click().then(function () {
                  browser.waitForAngular().then(function () {
                    page.getJsonPreviewText.then(function (value) {
                      var json = JSON.parse(value);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.minItems == undefined).toBe(true);
                      expect(json.properties.textFieldTitle && json.properties.textFieldTitle.maxItems == undefined).toBe(true);
                    });
                  });
                });
              });
            });
          });
        });


      });


    })
    (pageNames[j]);
  }
});



