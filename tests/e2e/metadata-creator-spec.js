'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

var template;
var element;
var folder;

xdescribe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var metadataPage = MetadataPage;
  var templatePage = TemplatePage;
  var toastyModal = ToastyModal;
  var sweetAlertModal = SweetAlertModal;

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

    it("should create the sample template", function () {
      template = workspacePage.createTitle('template');
      workspacePage.createResource('template', template);
      resources.push(createResource(template, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    // put a test between the creation of a resource and the search for it
    // it may take two seconds to index the new resource
    it("should have a logo", function () {
      workspacePage.hasLogo();
    });

    it("should have a control bar", function () {
      workspacePage.hasControlBar();
    });

    it("should search for the sample template in the workspace ", function () {
      workspacePage.searchForResource(template, 'template');
      workspacePage.clearSearch();
    });

    it("should add some fields to our template", function () {
      workspacePage.editResource(template, 'template');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.addField('textfield', false, 'two', 'two');
      templatePage.clickSave('template');
      toastyModal.isSuccess();

      templatePage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should create a folder", function () {
      folder = workspacePage.createTitle('folder');
      workspacePage.createResource('folder', folder);
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should create an element", function () {
      element = workspacePage.createElement('');
      resources.push(createResource(element, 'element', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should add some fields to the element", function () {
      workspacePage.editResource(element, 'element');
      templatePage.addField('textfield', false, 'one', 'one');
      templatePage.addField('textfield', false, 'two', 'two');
      templatePage.clickSave('element');
      toastyModal.isSuccess();
      templatePage.topNavBackArrow().click();

      //TODO confirm should not be required but it is here
      sweetAlertModal.confirm();
      sweetAlertModal.isHidden();
    });

    // TODO not working
    xit("should add the element to our template", function () {
      workspacePage.editResource(template, 'template');
      templatePage.addFirstElement(element);
      templatePage.clickSave('template');
      toastyModal.isSuccess();
      templatePage.topNavBackArrow().click();
    });

    it("should create an instance from our sample template", function () {
      workspacePage.populateResource(template, 'template');
      resources.push(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should create another instance from our sample template", function () {
      workspacePage.populateResource(template, 'template');
      resources.push(createResource(template, 'metadata', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should show instance header, back arrow, title, and json preview", function () {
      workspacePage.doubleClickResource(template, 'metadata');
      expect(metadataPage.topNavigation().isDisplayed()).toBe(true);
      expect(metadataPage.topNavBackArrow().isDisplayed()).toBe(true);
      expect(metadataPage.documentTitle().isDisplayed()).toBe(true);
      expect(metadataPage.metadataJson().isDisplayed()).toBe(true);
    });

    it("should have the correct document title", function () {
      browser.wait(EC.presenceOf(metadataPage.documentTitle()));
      metadataPage.documentTitle().getText().then(function (text) {
        expect(text === sampleTitle + ' metadata').toBe(true);
      });
    });

    it("should return to workspace by clicking back arrow", function () {
      metadataPage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should open existing metadata with open menu", function () {
      workspacePage.editResource(template, 'metadata');
      workspacePage.onMetadata();
    });

    it("should return to workspace by clicking back arrow", function () {
      metadataPage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });

    it("should open existing metadata with a double click", function () {
      workspacePage.doubleClickResource(sampleTitle, 'metadata');
      workspacePage.onMetadata();
    });

    it("should return to workspace by clicking back arrow", function () {
      metadataPage.topNavBackArrow().click();
      workspacePage.onWorkspace();
    });
  });

  describe('remove created resources', function () {

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

