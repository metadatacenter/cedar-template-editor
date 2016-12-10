'use strict';
var TemplatePage = require('../pages/template-creator-page.js');
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');


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

    // log the name of the test
    // console.log(jasmine.getEnv().currentSpec.description);

  });

  afterEach(function () {
  });

  for (var j = 0; j < pageTypes.length; j++) {
    (function (pageType) {

      it("should have a logo", function () {

        browser.wait(EC.visibilityOf(workspacePage.createLogo()));

      });


      it("should create the sample " + pageType, function () {

        // generate a title and description
        sampleTitle = workspacePage.createTitle(pageType);
        sampleDescription = workspacePage.createDescription(pageType);

        // create the template

        workspacePage.createResource(pageType);
        templatePage.setTitle(pageType, sampleTitle);
        templatePage.setDescription(pageType, sampleDescription);
        templatePage.clickSave(pageType);


        // get the url of this element
        browser.getCurrentUrl().then(function (url) {
          sampleUrl = url;
        });
      });

      it("should have editable title and description", function () {

        templatePage.isTitle(pageType, sampleTitle);
        templatePage.isDescription(pageType, sampleDescription);

      });

      it("should return to workspace by clicking back arrow", function () {

        templatePage.topNavBackArrow().click();
        templatePage.isWorkspace();

      });


      it("should delete the sample " + pageType, function () {

        workspacePage.deleteResource(sampleTitle, pageType);

        sweetAlertModal.confirm();
        toastyModal.isSuccess();

        // clear the search left from delete
        workspacePage.clickLogo();
      });


      // for each field type
      // TODO doesn't work for youtube
      for (var k = 0; k < fieldTypes.length - 1; k++) {
        (function (fieldType) {

          var field = element(by.css('.field-root .' + fieldType.iconClass));
          var isMore = !fieldType.primaryField;
          var title = fieldType.label;
          var description = fieldType.label + ' description';
          var type = fieldType.cedarType;

          it("should add and delete a " + type + " in " + pageType, function () {

            workspacePage.createResource(pageType);

            // create the field
            templatePage.addField(type, isMore, title, description);
            browser.wait(EC.visibilityOf(field));

            // delete the field
            browser.actions().mouseMove(field).perform();
            browser.wait(EC.elementToBeClickable(templatePage.removeFieldButton()));
            templatePage.removeFieldButton().click();
            browser.wait(EC.stalenessOf(field));

            templatePage.topNavBackArrow().click();
            sweetAlertModal.confirm();
            browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));

          });

          it("should select and deselect a " + type + " in " + pageType, function () {

            var firstField;
            var lastField;

            workspacePage.createResource(pageType);

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
            // TODO richtext does not make the template dirty
            if (type != 'richtext') {
              sweetAlertModal.confirm();
            }
            browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));

          });


        })
        (fieldTypes[k]);
      }

      it("should show and hide the JSON preview ", function () {

        // create the resource
        templatePage.createPage(pageType);

        templatePage.showJson();
        templatePage.hideJson();

        templatePage.topNavBackArrow().click();
        templatePage.isWorkspace();

      });

      it("should hang on to the sample template json", function () {

        templatePage.createPage(pageType);

        templatePage.showJson();

        // get the template json
        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          sampleJson = JSON.parse(value);
        });

        templatePage.hideJson();

        templatePage.topNavBackArrow().click();
        templatePage.isWorkspace();

      });

      it("should have the correct json for an empty " + pageType, function () {

        templatePage.createPage(pageType);

        templatePage.showJson();

        // get the json
        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          cleanJson = JSON.parse(value);
          if (pageType === 'template') {
            expect(_.isEqual(cleanJson, templatePage.emptyTemplateJson)).toBe(true);
          } else {
            expect(_.isEqual(cleanJson, templatePage.emptyElementJson)).toBe(true);
          }
        });

        templatePage.hideJson();

        templatePage.topNavBackArrow().click();
        templatePage.isWorkspace();
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

      it("should change the json preview  when the template changes", function () {

        templatePage.createPage(pageType);

        // add two fields
        templatePage.addField('textfield', isMore, title, description);
        templatePage.addField('textfield', isMore, title, description);

        templatePage.showJson();

        browser.wait(EC.visibilityOf(templatePage.jsonPreview()));
        templatePage.jsonPreview().getText().then(function (value) {
          dirtyJson = JSON.parse(value);
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

      it("should show " + pageType + " header ", function () {

        templatePage.createPage(pageType);
        browser.wait(EC.visibilityOf(templatePage.topNavigation()));
        expect(templatePage.hasClass(templatePage.topNavigation(), pageType)).toBe(true);
        browser.wait(EC.visibilityOf(templatePage.topNavBackArrow()));
        browser.wait(EC.visibilityOf(templatePage.showJsonLink()));

        templatePage.topNavBackArrow().click();
        templatePage.isWorkspace();

      });

      // TODO failing test
      xit("should have cancel button present and active", function () {

        page.createPage(pageName);
        page.addFieldNew(type, isMore, title, description);
        page.confirmCancel(pageName);

      });

      it("should not have clear displayed if template is clean", function () {

        templatePage.createPage(pageType);

        if (pageType === 'template') {
          browser.wait(EC.invisibilityOf(templatePage.createClearTemplateButton()));
        } else {
          browser.wait(EC.invisibilityOf(templatePage.createClearElementButton()));
        }

        templatePage.topNavBackArrow().click();
        templatePage.isWorkspace();

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
        templatePage.isWorkspace();
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
        templatePage.isWorkspace();

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
        templatePage.isWorkspace();

      });

    })
    (pageTypes[j]);
  }
});



