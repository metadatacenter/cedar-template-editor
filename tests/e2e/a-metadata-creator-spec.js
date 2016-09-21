'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var _ = require('../libs/lodash.min.js');

var sampleTitle;


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
    sampleTitle = "template" + metadataPage.getRandomInt(1, 99999);
    workspacePage.createTemplate();
    templatePage.setTemplateTitle(sampleTitle);
    templatePage.addTextField();
    templatePage.clickSaveTemplate();
  });


  it("should show metadata editor header, title, description, and json preview", function () {

    workspacePage.openTemplate(sampleTitle).then(function () {

      expect(metadataPage.isMetadata()).toBe(true);

      // should have top nav basics
      expect(metadataPage.topNavigation().isDisplayed()).toBe(true);
      expect(metadataPage.topNavBackArrow().isDisplayed()).toBe(true);
      expect(metadataPage.documentTitle().isDisplayed()).toBe(true);
      expect(metadataPage.templateJson().isDisplayed()).toBe(true);
      expect(metadataPage.metadataJson().isDisplayed()).toBe(true);

      // and the right document
      metadataPage.documentTitle().getText().then(function (text) {
        expect(sampleTitle === text).toBe(true);
      });

      // and the right page title
      metadataPage.pageTitle().getText().then(function (text) {
        expect(metadataPage.metadataPageTitle() === text).toBe(true);
      });
    });
  });

  it("should create metadata from the template", function () {
    workspacePage.openTemplate(sampleTitle).then(function () {
      browser.wait(metadataPage.createSaveMetadataButton().isPresent()).then(function () {
        browser.wait(metadataPage.createSaveMetadataButton().isDisplayed()).then(function () {
          metadataPage.clickSaveMetadata();
        });
      });
    });
  });

  it("should delete metadata from the workspace, ", function () {
    workspacePage.deleteResource(sampleTitle, workspacePage.metadataType());
  });

  it("should delete template from the workspace, ", function () {
    workspacePage.deleteResource(sampleTitle, workspacePage.templateType());
  });

});

