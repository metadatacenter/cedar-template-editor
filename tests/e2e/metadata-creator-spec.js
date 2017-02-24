'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');

var _ = require('../libs/lodash.min.js');
var sampleTitle;
var sampleDescription;
var sampleTemplateUrl;
var sampleMetadataUrl ;
var pageName = 'template';


describe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var workspacePage;
  var templatePage;
  var toastyModal;
  var sweetAlertModal;

  // before each test
  // maximize the window area for clicking
  beforeEach(function () {

    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    browser.driver.manage().window().maximize();

  });

  afterEach(function () {
  });


  it("should have a logo", function () {
    workspacePage.hasLogo();
    workspacePage.onWorkspace();
  });

  it("should have a control bar", function () {
    workspacePage.hasControlBar();
    workspacePage.onWorkspace();
  });

  it("should create the sample template", function () {
    sampleTitle = workspacePage.createTitle('template');
    console.log('sampleTitle' + sampleTitle);
    workspacePage.createResource('template', sampleTitle);
    workspacePage.onWorkspace();
  });

  it("should wait for sample template to be indexed", function () {
    browser.sleep(5000);
  });

  it("should search for the sample template in the workspace ", function () {
    console.log('sampleTitle' + sampleTitle);
    workspacePage.searchForResource(sampleTitle, 'template');
    workspacePage.onWorkspace();
  });

  it("should clear any ongoing search", function () {
    workspacePage.clearSearch();
    workspacePage.onWorkspace();
  });

  it("should create metadata from our sample template", function () {
    workspacePage.populateResource(sampleTitle, 'template');
    workspacePage.onWorkspace();
  });

  it("should create another metadata from our sample template", function () {
    workspacePage.populateResource(sampleTitle, 'template');
    workspacePage.onWorkspace();
  });

  it("should show metadata header, back arrow, title, and json preview", function () {
    workspacePage.doubleClickResource(sampleTitle, 'metadata');
    expect(metadataPage.topNavigation().isDisplayed()).toBe(true);
    expect(metadataPage.topNavBackArrow().isDisplayed()).toBe(true);
    expect(metadataPage.documentTitle().isDisplayed()).toBe(true);
    expect(metadataPage.templateJson().isDisplayed()).toBe(true);
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

  it("should open existing metadata with edit menu", function () {
    workspacePage.editResource(sampleTitle, 'metadata');
    browser.wait(EC.presenceOf(element(by.css('.navbar.metadata'))));
  });

  it("should return to workspace by clicking back arrow", function () {
    metadataPage.topNavBackArrow().click();
    workspacePage.onWorkspace();
  });

  it("should open existing metadata with a double click", function () {
    workspacePage.doubleClickResource(sampleTitle, 'metadata');
    metadataPage.onMetadata();
  });

  // TODO we currently don't have the page titled embedded here anymore...used to
  xit("should have the correct page title", function () {
    browser.wait(EC.presenceOf(metadataPage.pageTitle()));
    metadataPage.pageTitle().getText().then(function (text) {
      expect(text === 'Metadata Editor').toBe(true);
    });
  });

  it("should return to workspace by clicking back arrow", function () {
    metadataPage.topNavBackArrow().click();
    workspacePage.onWorkspace();
  });

  it('should delete the sample metadata from the workspace', function () {
    workspacePage.deleteResource(sampleTitle, 'metadata');
  });

  it('should delete the sample template from the workspace', function () {
    workspacePage.deleteResource(sampleTitle, 'template');
  });

  xit('should delete the any test template from the workspace', function () {
    workspacePage.deleteResource('Protractor', 'template');
  });

  // turn these one if you need to clean up the workspace
  xit('should delete the any test template from the workspace', function () {
    workspacePage.deleteResource('Protractor', 'metadata');
  });


  // turn these one if you need to clean up the workspace
  for (var i = 0; i < 0; i++) {

    it('should delete the any test template from the workspace', function () {
      workspacePage.deleteResource('Protractor', 'template');
    });

    // turn these one if you need to clean up the workspace
    it("should delete any test metadata from the workspace", function () {
      workspacePage.deleteResource('Protractor', 'folder');
    });

    // turn these one if you need to clean up the workspace
    it('should delete the any test template from the workspace', function () {
      workspacePage.deleteResource('Protractor', 'metadata');
    });

    // turn these one if you need to clean up the workspace
    it("should delete any test metadata from the workspace", function () {
      workspacePage.deleteResource('Readable', 'folder');
    });

    // turn these one if you need to clean up the workspace
    it('should delete the any test template from the workspace', function () {
      workspacePage.deleteResource('Shared', 'folder');
    });

    // turn these one if you need to clean up the workspace
    it("should delete any test metadata from the workspace", function () {
      workspacePage.deleteResource('Target', 'folder');
    });

    // turn these one if you need to clean up the workspace
    it("should delete any test metadata from the workspace", function () {
      workspacePage.deleteResource('Source', 'folder');
    });

  }


});

