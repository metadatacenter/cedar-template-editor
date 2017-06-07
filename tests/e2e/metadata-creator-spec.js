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
    workspacePage.onWorkspace();
  });

  describe('create metadata', function () {

    // put a test between the creation of a resource and the search for it
    // it may take two seconds to index the new resource
    it("should have a logo and control bar", function () {
      workspacePage.hasLogo();
      workspacePage.hasControlBar();
      workspacePage.onWorkspace();
    });

    it("should create the sample template", function () {
      template = workspacePage.createTemplate('Source');
      workspacePage.onWorkspace();

      // save file for deletion later
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

      // return to workspace
      templatePage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should create a folder", function () {
      folder = workspacePage.createFolder('folder');
      workspacePage.onWorkspace();

      // save file for deletion later
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should create an element", function () {
      element = workspacePage.createElement('element');
      workspacePage.onWorkspace();

      // save file for deletion later
      resources.push(createResource(element, 'element', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should add some fields to the element", function () {
      workspacePage.editResource(element, 'element');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.addField('textfield', false, 'two', 'two');
      templatePage.clickSave('element');
      toastyModal.isSuccess();

      // return to workspace
      templatePage.topNavBackArrow().click();
      //TODO confirm should not be required but it is here
      sweetAlertModal.confirm();
      sweetAlertModal.isHidden();
      workspacePage.onWorkspace();
    });

    it("should add the element to the template and make the element multiple with min cardinality 0, max unlimited", function () {
      workspacePage.editResource(template, 'template');
      templatePage.openFinder();
      finderModal.clearSearch();
      finderModal.addFirstElement(element);
      // set to min 0 max unlimited
      templatePage.setMultiple();
      templatePage.clickSave('template');
      toastyModal.isSuccess();

      // return to workspace
      templatePage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should populate the sample template", function () {
      workspacePage.populateResource(template, 'template');

      // save file for deletion later, delete this first
      resources.unshift(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should open metadata with open menu", function () {
      workspacePage.editResource(template, 'metadata');
      workspacePage.onMetadata();

      // return to workspace
      metadataPage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should open metadata with double-click showing header, back arrow, title, json preview and first instance of the multi-instance element", function () {
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

      // return to workspace
      metadataPage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });
  });

  describe('remove all created resources', function () {

    it('should delete resource from the user workspace', function () {
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

