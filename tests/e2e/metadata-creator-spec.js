'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var FinderModal = require('../modals/finder-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var testConfig = require('../config/test-env.js');
var _ = require('../libs/lodash.min.js');

describe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var metadataPage = MetadataPage;
  var templatePage = TemplatePage;
  var toastyModal = ToastyModal;
  var finderModal = FinderModal;
  var sweetAlertModal = SweetAlertModal;


  var template;
  var element;
  var folder;
  var fields;
  var firstField;
  var lastField;

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

  it("should be on the workspace", function () {
    console.log("metadata-creator should be on the workspace");
    workspacePage.onWorkspace();
  });

  /**
   * Test the metadata editor by first creating some test data,
   * then opening it to manipulate items in the metadata editor.
   *
   * Everything that is created is deleted at the end of the spec.
   *
   */
  describe('create metadata', function () {

    // put a test between the creation of a resource and the search for it
    // it may take two seconds to index the new resource
    it("metadata-creator create metadata should have a logo and control bar", function () {
      workspacePage.hasLogo();
      workspacePage.hasControlBar();
      workspacePage.onWorkspace();
    });

    it("should create the sample template", function () {
      template = workspacePage.createTemplate('Source');
      workspacePage.onWorkspace();
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should search for the sample template in the workspace ", function () {
      workspacePage.searchForResource(template, 'template');
      workspacePage.clearSearch();
      workspacePage.onWorkspace();
    });

    it("should add  fields to our template", function () {
      workspacePage.editResource(template, 'template');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.addField('textfield', false, 'two', 'two');
      templatePage.clickSave('template');
      toastyModal.isSuccess();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();
    });

    xit("should populate the sample template", function () {
      workspacePage.populateResource(template, 'template');
      metadataPage.addFieldValue('value');
      workspacePage.onMetadata();
      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();

    });

    it("should create an element", function () {
      element = workspacePage.createElement('element');
      workspacePage.onWorkspace();
      resources.push(createResource(element, 'element', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should add a field to the element", function () {
      workspacePage.editResource(element, 'element');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.isDirty();
      templatePage.clickSave('element');
      toastyModal.isSuccess();
      workspacePage.onElement();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();
    });

    it("should add the element to the template and make the element multiple with min cardinality 0, max unlimited", function () {
      workspacePage.editResource(template, 'template');
      templatePage.openFinder();
      finderModal.clearSearch();
    });

    it("should add the element to the template", function () {
      finderModal.addFirstElement(element);
      // TODO
      //templatePage.setMultiple();
      //templatePage.isDirty();
    });

    it("should save the template", function () {
      templatePage.clickSave('template');
      toastyModal.isSuccess();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();
    });

    it("should populate the sample template", function () {
      workspacePage.populateResource(template, 'template');

      // save file for deletion later, delete this first
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));
    });

    xit("should open the template and make sure it is read-only mode", function () {
      workspacePage.editResource(template, 'template');
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();
      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();
    });

    it("should open metadata with open menu", function () {
      workspacePage.editResource(template, 'metadata');
      workspacePage.onMetadata();
      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();
    });



    it("should open metadata with double-click showing header, back arrow, title, and first instance of the multi-instance element", function () {
      workspacePage.doubleClickResource(template, 'metadata');
      expect(metadataPage.topNavigation().isDisplayed()).toBe(true);
      expect(metadataPage.documentTitle().isDisplayed()).toBe(true);

      // look at the value of the document title
      browser.wait(EC.presenceOf(metadataPage.documentTitle()));
      metadataPage.documentTitle().getText().then(function (text) {
        expect(text === template + ' metadata').toBe(true);
      });

      // TODO make sure the element is multi-instance and is clickable -> only works if spreadsheets are not the default view
      // metadataPage.checkMultiple();
      // metadataPage.addInstance();
    });

    // TODO should be dirty
    xit("should should be dirty", function () {
      //metadataPage.isDirty();
    });

    it("should return to the workspace", function () {
      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();
    });
  });

  describe('create static fields', function () {

    it("should create a template with static fields", function () {
      var template = workspacePage.createTemplate('Static');
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));

      workspacePage.editResource(template, 'template');
      templatePage.addField('image', true, 'image', 'image',
          "https://farm8.static.flickr.com/7178/14027473486_63ec060a17_z.jpg");
      templatePage.addField('textfield', false, 'one', 'one');

      templatePage.addField('richtext', true, 'richtext', 'richtext',"testing");
      templatePage.addField('textfield', false, 'two', 'two');

      templatePage.clickSave('template');
      toastyModal.isSuccess();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();

      workspacePage.populateResource(template, 'template');
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));

      workspacePage.editResource(template, 'metadata');
      workspacePage.onMetadata();

      expect(templatePage.createQuestion().isPresent()).toBe(true);
      var fields = templatePage.createQuestions();


      fields.count().then(function (value) {
        expect(value).toBe(2);
      });

      var firstField = fields.first();
      expect(firstField.isPresent()).toBe(true);
      var lastField = fields.last();
      expect(lastField.isPresent()).toBe(true);

      //TODO these work locally but fail on Travis
      // browser.actions().mouseMove(firstField).perform();
      // browser.wait(EC.elementToBeClickable(firstField));
      // firstField.click();
      //expect(templatePage.createImage().isPresent()).toBe(true);

      // browser.actions().mouseMove(lastField).perform();
      // browser.wait(EC.elementToBeClickable(lastField));
      // lastField.click();
      // expect(templatePage.createRichtext().isPresent()).toBe(true);

      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();
    });
  });

  describe('create spreadsheets', function () {

    xit("should view a template as spreadsheet", function () {
      var template = workspacePage.createTemplate('Source');
      workspacePage.onWorkspace();
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));

      workspacePage.editResource(template, 'template');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.setMultiple();

      templatePage.clickSave('template');
      toastyModal.isSuccess();
      templatePage.clickBackArrow();
      workspacePage.onWorkspace();

      workspacePage.populateResource(template, 'template');
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));

      workspacePage.editResource(template, 'metadata');
      metadataPage.switchToSpreadsheet();

      metadataPage.clickBackArrow();
      workspacePage.onWorkspace();
    });
  });


  describe('remove all created resources', function () {

    it('should delete resource from the user workspace', function () {
      workspacePage.deleteResources(resources);
      // for (var i = 0; i < resources.length; i++) {
      //   (function (resource) {
      //     console.log("metadata-creator should delete " + resource.title + " for user " + resource.username);
      //     workspacePage.login(resource.username, resource.password);
      //     workspacePage.deleteResourceViaRightClick(resource.title, resource.type);
      //     toastyModal.isSuccess();
      //     workspacePage.clearSearch();
      //   })
      //   (resources[i]);
      // }
    });
  });

});

