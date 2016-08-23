'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var _ = require('../libs/lodash.min.js');


describe('metadata-creator', function () {
  var metadataPage;
  var workspacePage;
  var templatePage;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    metadataPage = MetadataPage;
    workspacePage = WorkspacePage;
    templatePage = TemplatePage;
    workspacePage.get();
    workspacePage.selectGridView();
    browser.driver.manage().window().maximize();

  });

  it("should create the sample template", function () {
    workspacePage.createTemplate();
    templatePage.setTemplateTitle(workspacePage.sampleTemplateTitle());
    templatePage.addTextField();
    templatePage.clickSaveTemplate();
  });


  it("should show metadata editor header, title, description, and json preview", function () {

    workspacePage.openTemplate(workspacePage.sampleTemplateTitle()).then(function () {

      expect(metadataPage.isMetadata()).toBe(true);

      // should have top nav basics
      expect(metadataPage.topNavigation.isDisplayed()).toBe(true);
      expect(metadataPage.topNavBackArrow.isDisplayed()).toBe(true);
      expect(metadataPage.documentTitle.isDisplayed()).toBe(true);
      expect(metadataPage.templateJson.isDisplayed()).toBe(true);
      expect(metadataPage.metadataJson.isDisplayed()).toBe(true);

      // and the right document
      metadataPage.documentTitle.getText().then(function (text) {
        expect(workspacePage.sampleTemplateTitle() === text).toBe(true);
      });

      // and the right page title
      metadataPage.pageTitle.getText().then(function (text) {
        expect(metadataPage.metadataPageTitle === text).toBe(true);
      });

      metadataPage.topNavBackArrow.click().then(function () {
        browser.sleep(1000);
        expect(metadataPage.isDashboard()).toBe(true);
      });
    });
  });


  it("should have Cancel button present and active", function () {

    workspacePage.openTemplate(workspacePage.sampleTemplateTitle()).then(function () {

      expect(metadataPage.isMetadata()).toBe(true);

      // make the metadata  dirty
      var firstTitle  = metadataPage.firstItemTitle;

      firstTitle.sendKeys(metadataPage.sampleTitle).sendKeys(protractor.Key.ENTER);
      firstTitle.getAttribute('value').then(function (value) {
        expect(value === metadataPage.sampleTitle).toBe(true);
      });

      // clicking the cancel should cancel edits
      metadataPage.clickCancelMetadata();
      expect(metadataPage.isDashboard()).toBe(true);
    });
  });

  it("should have save button present and active", function () {

    workspacePage.openTemplate(workspacePage.sampleTemplateTitle()).then(function () {

      expect(metadataPage.isMetadata()).toBe(true);

      // make the metadata  dirty
      var firstTitle  = metadataPage.firstItemTitle;

      firstTitle.sendKeys(metadataPage.sampleTitle).sendKeys(protractor.Key.ENTER);
      firstTitle.getAttribute('value').then(function (value) {
        expect(value === metadataPage.sampleTitle).toBe(true);
      });

      // clicking the save should save edits
      metadataPage.clickSaveMetadata();

    });
  });


  it("should delete sample template from the workspace, ", function () {

    workspacePage.deleteResource(workspacePage.sampleTemplateTitle(), workspacePage.templateType());

  });

});

