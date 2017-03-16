'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');

var _ = require('../libs/lodash.min.js');
var sampleTitle;
var sampleElementTitle;

// TODO turned off so we do not run out of time on Travis
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

  it("should create the sample template", function () {
    sampleTitle = workspacePage.createTitle('template');
    workspacePage.createResource('template', sampleTitle);
    workspacePage.onWorkspace();
  });

  // put a test between the creation of a resource and the search for it
  // it may take two seconds to index the new resource
  it("should have a control bar", function () {
    workspacePage.hasControlBar();
    workspacePage.onWorkspace();
  });

  it("should search for the sample template in the workspace ", function () {
    workspacePage.searchForResource(sampleTitle, 'template');
    workspacePage.clearSearch();
    workspacePage.onWorkspace();
  });


  it("should add some fields to our template", function () {
    workspacePage.editResource(sampleTitle, 'template');
    templatePage.addField('textfield', false, 'one', 'one');
    templatePage.addField('textfield', false, 'two', 'two');
    templatePage.clickSave('template');
    toastyModal.isSuccess();
    templatePage.topNavBackArrow().click();
    workspacePage.onWorkspace();
  });

  it("should create a folder", function () {
    var folderTitle = workspacePage.createTitle('folder');
    workspacePage.createResource('folder', folderTitle);
    workspacePage.onWorkspace();
  });

  it("should create an element", function () {
    sampleElementTitle = workspacePage.createElement('');
    workspacePage.onWorkspace();
  });

  it("should add some fields to the element", function () {
    workspacePage.editResource(sampleElementTitle, 'element');
    templatePage.addField('textfield', false, 'one', 'one');
    templatePage.addField('textfield', false, 'two', 'two');
    templatePage.clickSave('element');
    toastyModal.isSuccess();
    templatePage.topNavBackArrow().click();

    //TODO confirm should not be required but it is here
    sweetAlertModal.confirm();
    sweetAlertModal.isHidden();
    workspacePage.onWorkspace();
  });

  // TODO not working
  xit("should add the element to our template", function () {
    workspacePage.editResource(sampleTitle, 'template');
    templatePage.addFirstElement(sampleElementTitle);
    templatePage.clickSave('template');
    toastyModal.isSuccess();
    templatePage.topNavBackArrow().click();
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
    workspacePage.editResource(sampleTitle, 'metadata');
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

  it('should delete the sample metadata from the workspace', function () {
    workspacePage.deleteResource(sampleTitle, 'metadata');
  });

  xit('should delete the sample metadata from the workspace', function () {
    workspacePage.deleteResource(sampleTitle, 'metadata');
  });

  xit('should delete the sample template from the workspace', function () {
    workspacePage.deleteResource(sampleTitle, 'template');
  });


});

