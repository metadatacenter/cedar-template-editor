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


  var fieldType = templatePage.fieldTypes[0];
  var field = element(by.css('.field-root .' + fieldType.iconClass));
  var isMore = !fieldType.primaryField;
  var title = fieldType.label;
  var description = fieldType.label + ' description';
  var pageTypes = ['template', 'element'];
  var template;

  var resources = [];
  var createResource = function (title, type, username, password) {
    var result = new Object;
    result.title = title;
    result.type = type;
    result.username = username;
    result.password = password;
    return result;
  };

  jasmine.getEnv().addReporter(workspacePage.myReporter());

  beforeEach(function () {
  });

  afterEach(function () {
  });

  it("should be on the workspace page", function () {
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    workspacePage.onWorkspace();
    workspacePage.hasLogo();
  });

  it("should create the sample template ", function () {
    template = workspacePage.createTitle('Source');
    workspacePage.createResource('template', template, workspacePage.createDescription('Source'));
    resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
  });

  it("should update the json when changes ", function () {

    workspacePage.editResource(template, 'template');
    templatePage.isHiddenJson();
    templatePage.clickJsonPreview();
    templatePage.jsonPreview().getText().then(function (value) {
      cleanJson = JSON.parse(value);
      templatePage.addField('textfield', isMore, title, description);
      templatePage.jsonPreview().getText().then(function (value) {
        dirtyJson = JSON.parse(value);
        expect(_.isEqual(cleanJson, dirtyJson)).toBe(false);

        templatePage.clickBackArrow();
        sweetAlertModal.confirm();
        workspacePage.onWorkspace();
      });
    });
  });

  it("should check valid and dirty", function () {
    workspacePage.editResource(template, 'template');
    templatePage.isValid();
    templatePage.isClean();
    templatePage.addField('textfield', false, 'title', 'description');
    templatePage.isValid();
    templatePage.isDirty();
    templatePage.clickBackArrow();
    sweetAlertModal.confirm();
    workspacePage.onWorkspace();
  });

  describe('create resource', function () {

    // repeat tests for both template and element editors
    for (var j = 0; j < pageTypes.length; j++) {
      (function (pageType) {

        it("template-creator should create the sample " + pageType, function () {
          templateOrElement = workspacePage.createTitle(pageType);
          sampleDescription = workspacePage.createDescription(pageType);
          workspacePage.createResource(pageType, templateOrElement, sampleDescription);
          resources.push(createResource(templateOrElement, pageType, testConfig.testUser1, testConfig.testPassword1));
        });

        it("should have editable title and description", function () {
          workspacePage.editResource(templateOrElement, pageType);
          templatePage.isTitle(pageType, templateOrElement);
          templatePage.isDescription(pageType, sampleDescription);
          templatePage.isValid();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        it("should show " + pageType + " header and be valid and clean ", function () {
          workspacePage.createPage(pageType);
          browser.wait(EC.visibilityOf(templatePage.topNavigation()));
          expect(templatePage.hasClass(templatePage.topNavigation(), pageType)).toBe(true);
          templatePage.isValid();
          templatePage.isClean();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        it("should have cancel button present and active", function () {
          workspacePage.createPage(pageType);
          templatePage.addField('textfield', isMore, title, description);
          templatePage.isValid();
          templatePage.isDirty();
          templatePage.clickCancel(pageType);
          sweetAlertModal.confirm();
          workspacePage.onWorkspace();
        });

        it("should have clear displayed if " + pageType + " is dirty", function () {
          workspacePage.createPage(pageType);
          templatePage.addField('textfield', isMore, title, description);
          templatePage.isDirty();
          templatePage.isValid();
          templatePage.clickClear(pageType);
          sweetAlertModal.confirm();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        xit("should not change the " + pageType + " when cleared and cancelled", function () {

          workspacePage.createPage(pageType);
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

        // for each field type
        for (var k = 0; k < templatePage.fieldTypes.length; k++) {
          (function (fieldType) {

            var field = element(by.css('.field-root .' + fieldType.iconClass));
            var isMore = !fieldType.primaryField;
            var title = fieldType.label;
            var description = fieldType.label + ' description';
            var type = fieldType.cedarType;
            if (!fieldType.staticField) {

              it("should add and delete a " + type + " in " + pageType, function () {

                workspacePage.createPage(pageType);
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

                var firstField;
                var lastField;
                workspacePage.createPage(pageType);

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
                expect(lastField.element(by.model('fieldLabel[fieldLabelKey]')).isPresent()).toBe(true);
                expect(firstField.element(by.model('fieldLabel[fieldLabelKey]')).isPresent()).toBe(false);


                // click on the first field
                browser.actions().mouseMove(firstField).perform();
                browser.wait(EC.elementToBeClickable(firstField));
                firstField.click();

                // is the first selected and the second deselected
                expect(firstField.element(by.model('fieldLabel[fieldLabelKey]')).isPresent()).toBe(true);
                expect(lastField.element(by.model('fieldLabel[fieldLabelKey]')).isPresent()).toBe(false);

                templatePage.isDirty();
                // TODO valid not working for elements
                //templatePage.isValid();
                templatePage.clickBackArrow();
                sweetAlertModal.confirm();
                workspacePage.onWorkspace();
              });
            }
          })
          (templatePage.fieldTypes[k]);
        }

        // TODO the empty json needs to be updated from staging before we turn this on
        xit("should have valid json for empty " + pageType + " document ", function () {
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

        // fails on travis
        xit("should update the json when " + pageType + " changes ", function () {

          workspacePage.createPage(pageType);
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

        // TODO this should work when we get the right empty json from staging
        xit("should should restore the " + pageType + " when clear is clicked and confirmed", function () {

          workspacePage.createPage(pageType);
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

  describe('remove all created resources', function () {

    // clean up created resources
    it('should delete resource from the user workspace for user', function () {
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          workspacePage.login(resource.username, resource.password);
          workspacePage.deleteResource(resource.title, resource.type);
        })
        (resources[i]);
      }
    });

  });
});



