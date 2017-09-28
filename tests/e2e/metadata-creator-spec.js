'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var FinderModal = require('../modals/finder-modal.js');
var testConfig = require('../config/test-env.js');
var _ = require('../libs/lodash.min.js');

describe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var metadataPage = MetadataPage;
  var templatePage = TemplatePage;
  var toastyModal = ToastyModal;
  var finderModal = FinderModal;


  var template;
  var element;
  var folder;

  var resources = [];
  var createResource = function (title, type, username, password) {
    var result = new Object;
    result.title = title;
    result.type = type;
    result.username = username;
    result.password = password;
    return result;
  };

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
      console.log("metadata-creator should have a logo and control bar");
      workspacePage.hasLogo();
      workspacePage.hasControlBar();
      workspacePage.onWorkspace();
    });

    it("should create the sample template", function () {
      console.log("metadata-creator should create the sample template");
      template = workspacePage.createTemplate('Source');
      workspacePage.onWorkspace();

      // save file for deletion later
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should search for the sample template in the workspace ", function () {
      console.log("metadata-creator should search for the sample template in the workspace ");
      workspacePage.searchForResource(template, 'template');
      workspacePage.clearSearch();
      workspacePage.onWorkspace();
    });

    it("should add  fields to our template", function () {
      console.log("metadata-creator create metadata should add  fields to our template");
      workspacePage.editResource(template, 'template');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.addField('textfield', false, 'two', 'two');
      templatePage.clickSave('template');
      toastyModal.isSuccess();

      // return to workspace
      templatePage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should create an element", function () {
      console.log("metadata-creator create metadata should create an element");
      element = workspacePage.createElement('element');
      workspacePage.onWorkspace();

      // save file for deletion later
      resources.push(createResource(element, 'element', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should add some fields to the element", function () {
      console.log("metadata-creator should add some fields to the element");
      workspacePage.editResource(element, 'element');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.addField('textfield', false, 'two', 'two');
    });

    xit("should be dirty", function () {
      console.log("metadata-creator should should be dirty");
      templatePage.isDirty();
    });

    it("should should save the element", function () {
      console.log("metadata-creator should save the element");
      templatePage.clickSave('element');
    });

    it("should should see toasty", function () {
      console.log("metadata-creator should see toasty");
      toastyModal.isSuccess();
    });

    it("should be on element creator page", function () {
      console.log("metadata-creator should be on element creator page");
      workspacePage.onElement();
    });

    it("should should return to the workspace", function () {
      console.log("metadata-creator should return to the workspace");
      templatePage.topNavBackArrow().click();
    });


    // xit("should should confirm", function () {
    //   console.log("metadata-creator should confirm");
    //   sweetAlertModal.confirm();
    //   sweetAlertModal.isHidden();
    // });


    it("should should be on the workspace", function () {
      console.log("metadata-creator should be on the workspace");
      workspacePage.onWorkspace();
    });

    it("should add the element to the template and make the element multiple with min cardinality 0, max unlimited", function () {
      console.log("metadata-creator should add the element to the template and make the element multiple with min cardinality 0, max unlimited");
      workspacePage.editResource(template, 'template');
      templatePage.openFinder();
      finderModal.clearSearch();
      finderModal.addFirstElement(element);
      templatePage.setMultiple();
      templatePage.isDirty();
      templatePage.clickSave('template');
      toastyModal.isSuccess();

      // return to workspace
      templatePage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should populate the sample template", function () {
      console.log("metadata-creator should populate the sample template");
      workspacePage.populateResource(template, 'template');

      // save file for deletion later, delete this first
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should open metadata with open menu", function () {
      console.log("metadata-creator should open metadata with open menu");
      workspacePage.editResource(template, 'metadata');
      workspacePage.onMetadata();
    });

    it("should return to the workspace", function () {
      console.log("metadata-creator should return to the workspace");
      metadataPage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should still be on the workspace", function () {
      console.log("metadata-creator should still be on the workspace");
      workspacePage.onWorkspace();
    });

    it("should open metadata with double-click showing header, back arrow, title, json preview and first instance of the multi-instance element", function () {
      console.log("metadata-creator should open metadata with double-click showing header, back arrow, title, json preview a...");
      workspacePage.doubleClickResource(template, 'metadata');
      expect(metadataPage.topNavigation().isDisplayed()).toBe(true);
      expect(metadataPage.topNavBackArrow().isDisplayed()).toBe(true);
      expect(metadataPage.metadataJson().isDisplayed()).toBe(true);
      expect(metadataPage.documentTitle().isDisplayed()).toBe(true);

      // look at the value of the document title
      browser.wait(EC.presenceOf(metadataPage.documentTitle()));
      metadataPage.documentTitle().getText().then(function (text) {
        expect(text === template + ' metadata').toBe(true);
      });

      // make sure the element is multi-instance and is clickable
      metadataPage.checkMultiple();
      metadataPage.addInstance();

      // return to workspace
      metadataPage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });
  });

  describe('remove all created resources', function () {

    it('should delete resource from the user workspace', function () {
      console.log("metadata-creator should delete " + resources.length + " resources from the user workspace");
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
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

