'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyPage = require('../pages/toasty-page.js');
var SweetAlertPage = require('../pages/sweet-alert-page.js');

var _ = require('../libs/lodash.min.js');
var sampleTitle;
var sampleDescription;
var sampleTemplateUrl;
var sampleMetadataUrl;
var pageName = 'template';


xdescribe('metadata-creator', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var workspacePage;
  var templatePage;
  var toastyPage;
  var sweetAlertPage;
  var firstTimeOnly = true;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {

    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyPage = ToastyPage;
    sweetAlertPage = SweetAlertPage;
    browser.driver.manage().window().maximize();

    //TODO local needs sleep here, staging can handle sleep in the onPrepare
    if (firstTimeOnly) {
      browser.sleep(1000);
      firstTimeOnly = false;
    }

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

    // TODO check toasty message for success

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

    sweetAlertPage.confirm();
    toastyPage.isSuccess();

    // clear the search left from delete
    workspacePage.clickLogo();
  });

  it('should delete the sample template from the workspace', function () {
    workspacePage.deleteResource(sampleTitle, 'template');

    sweetAlertPage.confirm();
    toastyPage.isSuccess();

    // clear the search left from delete
    workspacePage.clickLogo();
  });

  xit("should delete any test metadata from the workspace", function () {
    workspacePage.deleteResource('template', 'metadata');

    sweetAlertPage.confirm();
    toastyPage.isSuccess();

    workspacePage.clickLogo();
  });

  xit('should delete the any test template from the workspace', function () {
    workspacePage.deleteResource('template', 'template');

    sweetAlertPage.confirm();
    toastyPage.isSuccess();

    workspacePage.clickLogo();
  });


});

