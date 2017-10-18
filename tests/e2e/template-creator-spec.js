'use strict';
var TemplatePage = require('../pages/template-creator-page.js');
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var testConfig = require('../config/test-env.js');
var _ = require('../libs/lodash.min.js');

// TODO turned off so we do not run out of time on Travis
describe('template-creator', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var templatePage = TemplatePage;
  var toastyModal = ToastyModal;
  var sweetAlertModal = SweetAlertModal;

  var cleanJson;
  var dirtyJson;
  var templateOrElement;
  var sampleDescription;
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
    }
  ];

  var fieldType = fieldTypes[0];
  var field = element(by.css('.field-root .' + fieldType.iconClass));
  var isMore = !fieldType.primaryField;
  var title = fieldType.label;
  var description = fieldType.label + ' description';
  var pageTypes = ['template', 'element'];

  var resources = [];
  var createResource = function (title, type, username, password) {
    var result = new Object;
    result.title = title;
    result.type = type;
    result.username = username;
    result.password = password;
    return result;
  };


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
  });

  afterEach(function () {
  });

  it("should be on the workspace page", function () {
    console.log("template-creator should be on the workspace page");
    workspacePage.onWorkspace();
    workspacePage.hasLogo();
  });

  it("should check back arrow", function () {
    console.log("template-creator should check back arrow");
    templatePage.createPage('template');
    templatePage.clickBackArrow();
    workspacePage.onWorkspace();
  });

  it("should check valid", function () {
    console.log("template-creator should check valid");
    templatePage.createPage('template');
    templatePage.addField('textfield', false, 'title', 'description');
    templatePage.clickSave('template');
    toastyModal.isSuccess();
    templatePage.isValid();
    templatePage.clickBackArrow();
    workspacePage.onWorkspace();
  });

  xit("should check dirty", function () {
    console.log("template-creator should check dirty");
    templatePage.createPage('template');
    templatePage.addField('textfield', false, 'title', 'description');
    templatePage.addField('textfield', false, 'title', 'description');
    templatePage.isDirty();
    templatePage.clickBackArrow();
    workspacePage.onWorkspace();
  });




  xdescribe('create resource', function () {

    // repeat tests for both template and element editors
    for (var j = 0; j < pageTypes.length; j++) {
      (function (pageType) {

        it("template-creator should create the sample " + pageType, function () {
          console.log("template-creator should create the sample " + pageType);
          templateOrElement = workspacePage.createTitle(pageType);
          sampleDescription = workspacePage.createDescription(pageType);
          workspacePage.createResource(pageType, templateOrElement, sampleDescription);
          resources.push(createResource(templateOrElement, pageType, testConfig.testUser1, testConfig.testPassword1));
        });

        it("should have editable title and description", function () {
          console.log("template-creator should have editable title and description");
          workspacePage.editResource(templateOrElement, pageType);
          templatePage.isTitle(pageType, templateOrElement);
          templatePage.isDescription(pageType, sampleDescription);
          templatePage.isValid();
          templatePage.clickBackArrow();
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


              it("should add and delete a " + type + " in " + pageType, function () {
                console.log("template-creator should add and delete a " + type + " in " + pageType);

                templatePage.createPage(pageType);
                templatePage.addField(type, isMore, title, description);
                browser.wait(EC.visibilityOf(field));


                // delete the field
                browser.actions().mouseMove(field).perform();
                var removeFieldButton = element(by.css('.field-root  .save-options .trash'));
                browser.wait(EC.visibilityOf(removeFieldButton));
                browser.wait(EC.elementToBeClickable(removeFieldButton));
                removeFieldButton.click();
                browser.wait(EC.stalenessOf(field));

                templatePage.isDirty();
                templatePage.isValid();
                templatePage.clickBackArrow();
                sweetAlertModal.confirm();
                workspacePage.onWorkspace();

              });

              it("should select and deselect a " + type + " in " + pageType, function () {
                console.log("template-creator should select and deselect a " + type + " in " + pageType);

                var firstField;
                var lastField;
                templatePage.createPage(pageType);

                // add two fields
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

                templatePage.isDirty();
                templatePage.isValid();
                templatePage.clickBackArrow();
                sweetAlertModal.confirm();
                workspacePage.onWorkspace();
              });
            }
          })
          (fieldTypes[k]);
        }

        it("should show " + pageType + " header ", function () {
          console.log("template-creator should show " + pageType + " header ");

          templatePage.createPage(pageType);
          browser.wait(EC.visibilityOf(templatePage.topNavigation()));
          expect(templatePage.hasClass(templatePage.topNavigation(), pageType)).toBe(true);
          browser.wait(EC.visibilityOf(templatePage.showJsonLink()));

          templatePage.isValid();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();

        });

        it("should have json preview turned off " + pageType, function () {
          console.log("template-creator should have json preview turned off " + pageType);
          workspacePage.editResource(templateOrElement, pageType);
          templatePage.isHiddenJson();
          templatePage.isValid();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        // TODO the empty json needs to be updated from staging before we turn this on
        xit("should have valid json for empty " + pageType + " document ", function () {
          console.log("template-creator should have valid json for empty " + pageType + " document");
          workspacePage.editResource(templateOrElement, pageType);
          templatePage.showJson();

          templatePage.jsonPreview().getText().then(function (value) {
            var json = JSON.parse(value);
            delete json._tmp;
            if (pageType === 'template') {
              expect(_.isEqual(json, templatePage.emptyTemplateJson)).toBe(true);
            } else {
              expect(_.isEqual(json, templatePage.emptyElementJson)).toBe(true);
            }
          });

          templatePage.hideJson();
          templatePage.isValid();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        it("should update the json when " + pageType + " changes ", function () {
          console.log("template-creator should update the json when " + pageType + " changes " + pageType);

          templatePage.createPage(pageType);
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
          templatePage.isDirty();
          templatePage.isValid();
          templatePage.clickBackArrow();
          sweetAlertModal.confirm();
          workspacePage.onWorkspace();
        });

        // TODO this should require confirmation but it doesn't
        it("should have cancel button present and active", function () {
          console.log("template-creator should have cancel button present and active");
          templatePage.createPage(pageType);
          templatePage.addField('textfield', isMore, title, description);
          templatePage.isDirty();
          templatePage.isValid();
          templatePage.clickCancel(pageType);
          //sweetAlertModal.confirm();
          workspacePage.onWorkspace();
        });

        it("should not change the " + pageType + " when cleared and cancelled", function () {
          console.log("template-creator should not change the " + pageType + " when cleared and cancelled");

          templatePage.createPage(pageType);
          templatePage.addField('textfield', isMore, title, description);
          templatePage.isDirty();
          templatePage.isValid();
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
          templatePage.isValid();
          templatePage.clickBackArrow();
          sweetAlertModal.confirm();
          workspacePage.onWorkspace();
        });

        it("should have clear displayed if " + pageType + " is dirty", function () {
          console.log("template-creator should have clear displayed if " + pageType + " is dirty");

          templatePage.createPage(pageType);
          templatePage.addField('textfield', isMore, title, description);
          templatePage.isDirty();
          templatePage.isValid();

          // clear and confirm
          templatePage.clickClear(pageType);
          sweetAlertModal.confirm();
          sweetAlertModal.isHidden();

          templatePage.clickBackArrow();
          sweetAlertModal.confirm();
          workspacePage.onWorkspace();

        });

        // TODO this should work when we get the right empty json from staging
        xit("should should restore the " + pageType + " when clear is clicked and confirmed", function () {
          console.log(
              "template-creator should should restore the " + pageType + " when clear is clicked and confirmed");

          templatePage.createPage(pageType);
          templatePage.addField('textfield', isMore, title, description);
          templatePage.clickClear(pageType);
          sweetAlertModal.confirm();
          sweetAlertModal.isHidden();
          templatePage.showJson();

          // get the  json
          browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
          templatePage.jsonPreview().getText().then(function (value) {
            var json = JSON.parse(value);
            delete json._tmp;
            if (pageType === 'template') {
              expect(_.isEqual(json, templatePage.emptyTemplateJson)).toBe(true);
            } else {
              expect(_.isEqual(json, templatePage.emptyElementJson)).toBe(true);
            }
          });

          templatePage.hideJson();
          templatePage.isValid();
          templatePage.clickBackArrow();
          sweetAlertModal.confirm();
          workspacePage.onWorkspace();
        });

      })
      (pageTypes[j]);
    }
  });

  xdescribe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      console.log("template-creator should delete " + resources.length + " resources from the user workspace");
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          console.log('should delete resource ' + resource.title + ' for user ' + resource.username);
          workspacePage.login(resource.username, resource.password);
          workspacePage.deleteResourceViaRightClick(resource.title, resource.type);
          toastyModal.isSuccess();
          workspacePage.clearSearch();
        })
        (resources[i]);
      }
    });
  });
});



