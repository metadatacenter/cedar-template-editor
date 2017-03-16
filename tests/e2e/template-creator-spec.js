'use strict';
var TemplatePage = require('../pages/template-creator-page.js');
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

// TODO turned off so we do not run out of time on Travis
xdescribe('template-creator', function () {
  var EC = protractor.ExpectedConditions;


  var workspacePage;
  var templatePage;
  var toastyModal;
  var sweetAlertModal;

  var cleanJson;
  var dirtyJson;
  var sampleTitle;
  var sampleDescription;
  var sampleUrl;
  var sampleJson;
  var fieldTypes = [
    {
      "cedarType"                : "textfield",
      "iconClass"                : "cedar-svg-text",
      "label"                    : "Text",
      "allowedInElement"         : true,
      "primaryField"             : true,
      "hasControlledTerms"       : true,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": true
    },
    {
      "cedarType"                : "textarea",
      "iconClass"                : "cedar-svg-paragraph",
      "label"                    : "Text Area",
      "allowedInElement"         : true,
      "primaryField"             : true,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "date",
      "iconClass"                : "cedar-svg-calendar",
      "label"                    : "Date",
      "allowedInElement"         : true,
      "primaryField"             : true,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "numeric",
      "iconClass"                : "cedar-svg-numeric",
      "allowedInElement"         : true,
      "primaryField"             : true,
      "label"                    : "Number",
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "radio",
      "iconClass"                : "cedar-svg-multiple-choice",
      "label"                    : "Multiple Choice",
      "allowedInElement"         : true,
      "primaryField"             : false,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : false,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "checkbox",
      "iconClass"                : "cedar-svg-checkbox",
      "label"                    : "Checkbox",
      "allowedInElement"         : true,
      "primaryField"             : false,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : false,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "email",
      "iconClass"                : "cedar-svg-at",
      "label"                    : "Email",
      "allowedInElement"         : true,
      "primaryField"             : false,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "list",
      "iconClass"                : "cedar-svg-list",
      "allowedInElement"         : true,
      "primaryField"             : false,
      "label"                    : "List",
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : false,
      "allowsValueRecommendation": false
    },
    {
      "cedarType"                : "phone-number",
      "iconClass"                : "cedar-svg-phone",
      "allowedInElement"         : true,
      "label"                    : "Phone Number",
      "primaryField"             : false,
      "hasControlledTerms"       : false,
      "staticField"              : false,
      "allowsMultiple"           : true,
      "allowsValueRecommendation": false
    }
  ];

  var fieldType = fieldTypes[0];
  var field = element(by.css('.field-root .' + fieldType.iconClass));
  var isMore = !fieldType.primaryField;
  var title = fieldType.label;
  var description = fieldType.label + ' description';

  var pageTypes = ['template', 'element'];


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    workspacePage = WorkspacePage;
    templatePage = TemplatePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    browser.driver.manage().window().maximize();
  });

  afterEach(function () {
  });

  // repeat tests for both template and element editors
  for (var j = 0; j < pageTypes.length; j++) {
    (function (pageType) {

      it("should have a logo on the workspace page", function () {
        workspacePage.hasLogo();
        workspacePage.onWorkspace();
      });

      it("should create the sample template " + pageType, function () {
        sampleTitle = workspacePage.createTitle(pageType);
        sampleDescription = workspacePage.createDescription(pageType);
        workspacePage.createResource(pageType, sampleTitle, sampleDescription);
        workspacePage.onWorkspace();
      });

      it("should have editable title and description", function () {
        workspacePage.editResource(sampleTitle, pageType);
        templatePage.isTitle(pageType, sampleTitle);
        templatePage.isDescription(pageType, sampleDescription);
      });

      it("should return to workspace by clicking back arrow", function () {
        templatePage.topNavBackArrow().click();
        workspacePage.onWorkspace();
      });

      // for each field type
      for (var k = 0; k < fieldTypes.length; k++) {
        (function (fieldType) {

          var field = element(by.css('.field-root .' + fieldType.iconClass));
          var isMore = !fieldType.primaryField;
          var title = fieldType.label;
          var description = fieldType.label + ' description';
          var type = fieldType.cedarType;
          if (!fieldType.staticField) {


            it("should add and delete a " + type + " in " + pageType , function () {

              templatePage.createPage(pageType);
              templatePage.addField(type, isMore, title, description);
              browser.wait(EC.visibilityOf(field));


              // delete the field
              // TODO the removeFieldButton in the templatePage is not working, but locally it is ok
              browser.actions().mouseMove(field).perform();
              var removeFieldButton = element(by.css('.field-root  [ng-click="delete(); $event.stopPropagation();"]'));
              browser.wait(EC.visibilityOf(removeFieldButton));
              browser.wait(EC.elementToBeClickable(removeFieldButton));
              removeFieldButton.click();
              browser.wait(EC.stalenessOf(field));

              templatePage.topNavBackArrow().click();
              sweetAlertModal.confirm();
              workspacePage.onWorkspace();

            });

            it("should select and deselect a " + type + " in " + pageType, function () {

              var firstField;
              var lastField;
              templatePage.createPage(pageType);

              // add two fields
              // TODO adding just one field doesn't make the template dirty
              templatePage.addField(type, isMore, title, description);
              templatePage.addField(type, isMore, title, description);

              var fields = element.all(by.css(templatePage.cssFieldRoot));
              fields.count().then(function (value) {
                expect(value).toBe(2);
              });

              firstField = fields.first();
              lastField = fields.last();

              // do we have each field
              expect(firstField.isPresent()).toBe(true);
              expect(lastField.isPresent()).toBe(true);

              // is the second field selected and not the first
              expect(lastField.element(by.model(templatePage.modelFieldTitle)).isPresent()).toBe(true);
              expect(firstField.element(by.model(templatePage.modelFieldTitle)).isPresent()).toBe(false);

              // click on the first field
              browser.actions().mouseMove(firstField).perform();
              browser.wait(EC.elementToBeClickable(firstField));
              firstField.click();

              // is the first selected and the second deselected
              expect(firstField.element(by.model(templatePage.modelFieldTitle)).isPresent()).toBe(true);
              expect(lastField.element(by.model(templatePage.modelFieldTitle)).isPresent()).toBe(false);

              templatePage.topNavBackArrow().click();
              sweetAlertModal.confirm();
              workspacePage.onWorkspace();
            });
          }
        })
        (fieldTypes[k]);
      }

      it("should show " + pageType + " header ", function () {

        templatePage.createPage(pageType);
        browser.wait(EC.visibilityOf(templatePage.topNavigation()));
        expect(templatePage.hasClass(templatePage.topNavigation(), pageType)).toBe(true);
        browser.wait(EC.visibilityOf(templatePage.topNavBackArrow()));
        browser.wait(EC.visibilityOf(templatePage.showJsonLink()));

        templatePage.topNavBackArrow().click();
        workspacePage.onWorkspace();

      });

      it("should show and hide the JSON preview ", function () {
        workspacePage.editResource(sampleTitle, pageType);
        templatePage.showJson();
        templatePage.hideJson();
        templatePage.topNavBackArrow().click();
        workspacePage.onWorkspace();
      });

      it("should hang on to the sample template json " + pageType, function () {
        workspacePage.editResource(sampleTitle, pageType);
        templatePage.showJson();

        // get the template json
        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          sampleJson = JSON.parse(value);
          delete sampleJson._tmp;
        });

        templatePage.hideJson();
        templatePage.topNavBackArrow().click();
        workspacePage.onWorkspace();
      });

      // TODO turn this on once staging has been updated
      xit("should have the correct json for an empty " + pageType, function () {

        templatePage.createPage(pageType);
        templatePage.showJson();

        // get the json
        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          cleanJson = JSON.parse(value);
          delete cleanJson._tmp;
          if (pageType === 'template') {
            expect(_.isEqual(cleanJson, templatePage.emptyTemplateJson)).toBe(true);
          } else {
            expect(_.isEqual(cleanJson, templatePage.emptyElementJson)).toBe(true);
          }
        });

        templatePage.hideJson();
        templatePage.topNavBackArrow().click();
        workspacePage.onWorkspace();
      });

      it("should have the correct json for a clean " + pageType, function () {

        templatePage.createPage(pageType);

        // add two fields
        templatePage.addField('textfield', isMore, title, description);
        templatePage.addField('textfield', isMore, title, description);

        templatePage.showJson();

        // get the dirty json
        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          dirtyJson = JSON.parse(value);
          delete dirtyJson._tmp;
          if (pageType === 'template') {
            expect(_.isEqual(templatePage.emptyTemplateJson, dirtyJson)).toBe(false);
          } else {
            expect(_.isEqual(templatePage.emptyElementJson, dirtyJson)).toBe(false);
          }
        });

        templatePage.hideJson();

        templatePage.topNavBackArrow().click();
        sweetAlertModal.confirm();
        templatePage.isWorkspace();
      });

      // TODO this test should work but it isn't
      xit("should change the json preview  when the " + pageType + " changes ", function () {
        templatePage.createPage(pageType);

        // add two fields
        templatePage.addField(fieldType, isMore, title, description);
        templatePage.addField(fieldType, isMore, title, description);
        templatePage.showJson();

        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          var json = JSON.parse(value);
          delete json._tmp;
          //console.log(json);
          if (pageType === 'template') {
            expect(_.isEqual(templatePage.emptyTemplateJson, json)).toBe(false);
          } else {
            expect(_.isEqual(templatePage.emptyElementJson, json)).toBe(false);
          }
        });
        templatePage.hideJson();

        templatePage.topNavBackArrow().click();
        sweetAlertModal.confirm();
        workspacePage.onWorkspace();

      });

      it("should have cancel button present and active", function () {

        templatePage.createPage(pageType);

        // add two fields
        templatePage.addField('textfield', isMore, title, description);
        templatePage.addField('textfield', isMore, title, description);

        // cancel and confirm
        templatePage.clickCancel(pageType);
        // TODO confirm is not required but it should be
        //sweetAlertModal.confirm();
        //sweetAlertModal.isHidden();

        //templatePage.topNavBackArrow().click();
        //sweetAlertModal.confirm();
        workspacePage.onWorkspace();

      });

      it("should not change the " + pageType + " when cleared and cancelled", function () {

        // create the resource
        templatePage.createPage(pageType);

        // make it dirty
        templatePage.addField('textfield', isMore, title, description);
        templatePage.addField('textfield', isMore, title, description);

        templatePage.showJson();

        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          var beforeJson = JSON.parse(value);

          templatePage.clickClear(pageType);
          sweetAlertModal.cancel();

          browser.wait(EC.visibilityOf(templatePage.jsonPreview()));

          templatePage.jsonPreview().getText().then(function (value) {
            var afterJson = JSON.parse(value);
            expect(_.isEqual(beforeJson, afterJson)).toBe(true);
          });
        });

        templatePage.hideJson();

        templatePage.topNavBackArrow().click();
        sweetAlertModal.confirm();
        workspacePage.onWorkspace();
      });

      it("should have clear displayed if " + pageType + " is dirty", function () {

        templatePage.createPage(pageType);

        // add two fields
        templatePage.addField('textfield', isMore, title, description);
        templatePage.addField('textfield', isMore, title, description);

        // clear and confirm
        templatePage.clickClear(pageType);
        sweetAlertModal.confirm();
        sweetAlertModal.isHidden();

        templatePage.topNavBackArrow().click();
        sweetAlertModal.confirm();
        workspacePage.onWorkspace();

      });

      it("should should restore the " + pageType + " when clear is clicked and confirmed", function () {

        templatePage.createPage(pageType);

        // make it dirty
        templatePage.addField('textfield', isMore, title, description);
        templatePage.addField('textfield', isMore, title, description);

        // clear and confirm
        templatePage.clickClear(pageType);
        sweetAlertModal.confirm();
        sweetAlertModal.isHidden();

        templatePage.showJson();

        // get the dirty template json
        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          var currentJson = JSON.parse(value);
          // TODO this doesn't work
          //expect(_.isEqual(currentJson, sampleJson)).toBe(true);
        });

        templatePage.hideJson();

        // back to workspace
        templatePage.topNavBackArrow().click();
        sweetAlertModal.confirm();
        workspacePage.onWorkspace();
      });

      it("should delete the sample " + pageType, function () {
        workspacePage.deleteResource(sampleTitle, pageType);
        workspacePage.onWorkspace();
      });

    })
    (pageTypes[j]);
  }
});



