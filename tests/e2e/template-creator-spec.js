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

  var templateOrElement;
  var sampleDescription;

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
    templateOrElement = workspacePage.createTitle('Source');
    workspacePage.createResource('template', templateOrElement, 'description');
    resources.push(createResource(templateOrElement, 'template', testConfig.testUser1, testConfig.testPassword1));
  });

  it("should update the json when changes ", function () {
    var cleanJson;
    var dirtyJson;

    workspacePage.doubleClickResource(templateOrElement, 'template');
    templatePage.showJson();
    templatePage.jsonPreview().getText().then(function (value) {

      cleanJson = JSON.parse(value);
      delete cleanJson._tmp;
      var fieldType = templatePage.fieldTypes[0];
      templatePage.addFieldType(fieldType, 'title', 'description', 'template');
      templatePage.jsonPreview().getText().then(function (value) {

        dirtyJson = JSON.parse(value);
        delete dirtyJson._tmp;
        expect(_.isEqual(cleanJson, dirtyJson)).toBe(false);
        templatePage.clickBackArrow();
        sweetAlertModal.confirm();
        workspacePage.onWorkspace();
      });
    });
  });

  it("should check valid and dirty", function () {
    workspacePage.doubleClickResource(templateOrElement, 'template');
    //templatePage.isValid();
    templatePage.isClean();
    templatePage.addFieldType(templatePage.fieldTypes[0], 'title', 'description','template');

    //templatePage.isValid();
    templatePage.isDirty();
    templatePage.clickBackArrow();
    sweetAlertModal.confirm();
    workspacePage.onWorkspace();
  });

  describe('create resource', function () {

    // repeat tests for both template and element editors
    for (var j = 0; j < templatePage.pageTypes.length; j++) {
      (function (pageType) {

        it("template-creator should create the sample " + pageType, function () {
          templateOrElement = workspacePage.createTitle(pageType);
          sampleDescription = workspacePage.createDescription(pageType);
          workspacePage.createResource(pageType, templateOrElement, sampleDescription);
          resources.push(createResource(templateOrElement, pageType, testConfig.testUser1, testConfig.testPassword1));
        });

        it("should have editable title and description", function () {
          workspacePage.doubleClickResource(templateOrElement, pageType);
          templatePage.isTitle(pageType, templateOrElement);
          templatePage.isDescription(pageType, sampleDescription);
          //templatePage.isValid();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        it("should have cancel button present and active", function () {
          workspacePage.createPage(pageType);
          templatePage.addFieldType(templatePage.fieldTypes[0], 'title', 'description', pageType);
          //templatePage.isValid();
          templatePage.isDirty();
          templatePage.clickCancel(pageType);
          sweetAlertModal.confirm();
          workspacePage.onWorkspace();
        });

        it("should have clear present and active if " + pageType + " is dirty", function () {
          workspacePage.createPage(pageType);
          templatePage.addFieldType(templatePage.fieldTypes[0], 'title', 'description', pageType);
          templatePage.clickClear(pageType);
          sweetAlertModal.confirm();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        it("should show " + pageType + " header and be valid and clean ", function () {
          workspacePage.createPage(pageType);
          browser.wait(EC.visibilityOf(templatePage.topNavigation()));
          expect(templatePage.hasClass(templatePage.topNavigation(), pageType)).toBe(true);
          //templatePage.isValid();
          templatePage.isClean();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        it("should not change the " + pageType + " when cleared and cancelled", function () {

          workspacePage.createPage(pageType);
          templatePage.addFieldType(templatePage.fieldTypes[0], 'title', 'description', pageType);

          templatePage.showJson();
          templatePage.jsonPreview().getText().then(function (value) {
            var dirtyJson = JSON.parse(value);
            delete dirtyJson._tmp;

            templatePage.clickClear(pageType);
            sweetAlertModal.cancel();

            templatePage.jsonPreview().getText().then(function (value) {
              var afterJson = JSON.parse(value);
              delete afterJson._tmp;
              expect(_.isEqual(dirtyJson, afterJson)).toBe(true);

              templatePage.clickBackArrow();
              sweetAlertModal.confirm();
              workspacePage.onWorkspace();
            });
          });
        });

        // for each field type
        for (var k = 0; k < templatePage.fieldTypes.length; k++) {
          (function (fieldType) {

            var field = element(by.css('.item-root.field-root i.' + fieldType.iconClass));
            if (!fieldType.staticField) {

              it("should add and delete a " + fieldType.cedarType + " in " + pageType, function () {

                workspacePage.createPage(pageType);
                templatePage.addFieldType(fieldType,  fieldType.label, fieldType.label + 'description', pageType);

                // delete the field
                browser.actions().mouseMove(field).perform();
                var removeFieldButton = element(by.css('div.item-root.field-root  .save-options .trash'));
                browser.wait(EC.visibilityOf(removeFieldButton));
                browser.wait(EC.elementToBeClickable(removeFieldButton));
                removeFieldButton.click();
                browser.wait(EC.stalenessOf(field));

                templatePage.isDirty();
                //templatePage.isValid();
                templatePage.clickBackArrow();
                sweetAlertModal.confirm();
                workspacePage.onWorkspace();
              });

              it("should select and deselect a " + fieldType.cedarType + " in " + pageType, function () {

                var firstField;
                var lastField;
                workspacePage.createPage(pageType);

                // add two fields
                templatePage.addFieldType(fieldType,  fieldType.label, fieldType.label + 'description', pageType);
                templatePage.addFieldType(fieldType,  fieldType.label, fieldType.label + 'description', pageType);

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
          workspacePage.doubleClickResource(templateOrElement, pageType);
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
          //templatePage.isValid();
          templatePage.clickBackArrow();
          workspacePage.onWorkspace();
        });

        // fails on travis
        it("should update the json when " + pageType + " changes ", function () {

          workspacePage.createPage(pageType);
          var fieldType = templatePage.fieldTypes[0];
          templatePage.addFieldType(fieldType, 'title', 'description', pageType);
          templatePage.isDirty();
          templatePage.showJson();

          // get the dirty json
          browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
          templatePage.jsonPreview().getText().then(function (value) {
            var dirtyJson = JSON.parse(value);
            delete dirtyJson._tmp;
            if (pageType === 'template') {
              expect(_.isEqual(templatePage.emptyTemplateJson, dirtyJson)).toBe(false);
            } else {
              expect(_.isEqual(templatePage.emptyElementJson, dirtyJson)).toBe(false);
            }
          });

          templatePage.hideJson();
          templatePage.isDirty();
          //templatePage.isValid();
          templatePage.clickBackArrow();
          sweetAlertModal.confirm();
          workspacePage.onWorkspace();
        });

        // TODO this should work when we get the right empty json from staging
        xit("should should restore the " + pageType + " when clear is clicked and confirmed", function () {

          workspacePage.createPage(pageType);
          var fieldType = templatePage.fieldTypes[0];
          templatePage.addFieldType(fieldType, 'title', 'description', pageType);
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
          //templatePage.isValid();
          templatePage.clickBackArrow();
          sweetAlertModal.confirm();
          workspacePage.onWorkspace();
        });

      })
      (templatePage.pageTypes[j]);
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



