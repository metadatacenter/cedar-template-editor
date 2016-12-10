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
var sampleMetadataUrl;
var pageName = 'template';


describe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var workspacePage;
  var templatePage;
  var toastyModal;
  var sweetAlertModal;

  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {

    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    browser.driver.manage().window().maximize();

    // log the name of the test
    //console.log(jasmine.getEnv().currentSpec.description);

  });

  afterEach(function () {
  });

  // in case we put this in a loop
  sampleTitle = null;
  sampleDescription = null;
  sampleTemplateUrl = null;
  sampleMetadataUrl = null;

  it("should have a logo", function () {

    browser.wait(EC.presenceOf(workspacePage.createLogo()));

  });

  it("should create the sample template", function () {

    // generate a title and description
    sampleTitle = workspacePage.createTitle('template');
    sampleDescription = workspacePage.createDescription('template');

    // create the template
    workspacePage.createResource('template');
    templatePage.setTitle('template', sampleTitle);
    templatePage.setDescription('template', sampleDescription);
    templatePage.isTitle('template', sampleTitle);
    templatePage.isDescription('template', sampleDescription);
    templatePage.clickSave('template');


    // get the url of this element
    browser.getCurrentUrl().then(function (url) {
      sampleTemplateUrl = url;
    });

    // get back to the workspace page
    templatePage.topNavBackArrow().click();
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));


  });

  it("should have a task bar", function () {

    browser.wait(EC.presenceOf(element(by.css('.controls-bar'))));

  });

  it("should create metadata from the template", function () {

    workspacePage.populateResource(sampleTitle, 'template');
    browser.wait(EC.presenceOf(element(by.css('.navbar.metadata'))));

    browser.wait(EC.presenceOf(metadataPage.createSaveMetadataButton()));
    metadataPage.createSaveMetadataButton().click().then(function () {
      browser.sleep(500);
      browser.ignoreSynchronization = true;
      var toast = element(by.css('#toasty .toast .toast-msg'));
      toast.getAttribute('value').then(function (v) {
        console.log(v);
      });
      var toastyClose = element(by.css('#toasty .toast .close-button'));
      toastyClose.click();


      browser.getCurrentUrl().then(function (url) {
        sampleMetadataUrl = url;
      });

      browser.sleep(500);
      browser.ignoreSynchronization = false;
    });
  });

  it("should show metadata header, back arrow, title, and json preview", function () {

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
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
  });

  it("should open existing metadata with edit menu", function () {

    workspacePage.editResource(sampleTitle, 'metadata');
    browser.wait(EC.presenceOf(element(by.css('.navbar.metadata'))));

  });

  it("should return to workspace by clicking back arrow", function () {
    metadataPage.topNavBackArrow().click();
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
  });

  it("should open existing metadata with a double click", function () {
    workspacePage.doubleClickResource(sampleTitle, 'metadata');
    browser.wait(EC.presenceOf(element(by.css('.navbar.metadata'))));
  });

  it("should return to workspace by clicking back arrow", function () {
    metadataPage.topNavBackArrow().click();
    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
  });

  xit("should have the correct page title", function () {

    browser.wait(EC.presenceOf(metadataPage.pageTitle()));
    metadataPage.pageTitle().getText().then(function (text) {
      expect(text === 'Metadata Editor').toBe(true);
    });
  });

  it("should delete sample metadata from the workspace", function () {
    workspacePage.deleteResource(sampleTitle, 'metadata');

    sweetAlertModal.confirm();
    toastyModal.isSuccess();

    // clear the search left from delete
    workspacePage.clickLogo();
  });

  it('should delete the sample template from the workspace', function () {
    workspacePage.deleteResource(sampleTitle, 'template');

    sweetAlertModal.confirm();
    toastyModal.isSuccess();

    // clear the search left from delete
    workspacePage.clickLogo();
  });

  xit("should delete any test metadata from the workspace", function () {
    workspacePage.deleteResource('template', 'metadata');

    sweetAlertModal.confirm();
    toastyModal.isSuccess();

    workspacePage.clickLogo();
  });

  xit('should delete the any test template from the workspace', function () {
    workspacePage.deleteResource('template', 'template');

    sweetAlertModal.confirm();
    toastyModal.isSuccess();

    workspacePage.clickLogo();
  });


});

