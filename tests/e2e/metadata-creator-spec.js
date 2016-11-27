'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyPage = require('../pages/toasty-page.js');

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
  var toastyPage;


  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {

    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyPage = ToastyPage;
    browser.driver.manage().window().maximize();

    workspacePage.get();

    browser.wait(EC.presenceOf(element(by.css('.navbar.dashboard'))));
    browser.ignoreSynchronization = null;

  });

  afterEach(function () {

    browser.ignoreSynchronization = true;

  });


  for (var j = 0; j < 1; j++) {

    sampleTitle = null;
    sampleDescription = null;
    sampleTemplateUrl = null;
    sampleMetadataUrl = null;


    (function () {

      // create the sample template
      it("should create the sample template", function () {

        sampleTitle = pageName + templatePage.getRandomInt(1, 9999999999);
        sampleDescription = sampleTitle + ' description';

        templatePage.createPage(pageName, sampleTitle, sampleDescription);
        templatePage.clickSave(pageName);
        toastyPage.isToastyNew();

        // get the url of this element
        browser.getCurrentUrl().then(function (url) {
          sampleTemplateUrl = url;
        });
      });

      it("should open the sample template", function () {

        workspacePage.doubleClickName(sampleTitle, 'template');
        browser.wait(EC.presenceOf(element(by.id('top-navigation'))));
      });

      it("should create metadata from the template", function () {

        workspacePage.doubleClickName(sampleTitle, 'template');
        browser.wait(EC.presenceOf(element(by.id('top-navigation'))));

        browser.wait(EC.presenceOf(metadataPage.createSaveMetadataButton()));
        metadataPage.createSaveMetadataButton().click();
        toastyPage.isToastyNew();

        browser.getCurrentUrl().then(function (url) {
          sampleMetadataUrl = url;
        });
      });

      it("should open metadata editor", function () {

        workspacePage.doubleClickName(sampleTitle, 'metadata');
        browser.wait(EC.presenceOf(element(by.css('.navbar.metadata'))));

      });

      it("should show metadata editor header, back arrow, title, and json preview", function () {

        workspacePage.doubleClickName(sampleTitle, 'metadata');
        browser.wait(EC.presenceOf(element(by.css('.navbar.metadata'))));

        expect(metadataPage.topNavigation().isDisplayed()).toBe(true);
        expect(metadataPage.topNavBackArrow().isDisplayed()).toBe(true);
        expect(metadataPage.documentTitle().isDisplayed()).toBe(true);
        expect(metadataPage.templateJson().isDisplayed()).toBe(true);
        expect(metadataPage.metadataJson().isDisplayed()).toBe(true);

      });

      it("should have the correct document title", function () {

        workspacePage.doubleClickName(sampleTitle, 'metadata');
        browser.wait(EC.presenceOf(element(by.id('top-navigation'))));
        browser.wait(EC.presenceOf(metadataPage.documentTitle()));

        // and the right document
        metadataPage.documentTitle().getText().then(function (text) {
          expect(text === sampleTitle + ' metadata').toBe(true);
        });

      });

      xit("should have the correct page title", function () {

        workspacePage.doubleClickName(sampleTitle, 'metadata');
        browser.wait(EC.presenceOf(element(by.id('top-navigation'))));
        browser.wait(EC.presenceOf(metadataPage.pageTitle()));

       metadataPage.pageTitle().getText().then(function (text) {
         // we are not showing the page title in the new form
         expect(text === 'Metadata Editor').toBe(true);
        });
      });

      it("should delete template from the workspace, ", function () {
        workspacePage.deleteResourceNew(sampleTitle, 'template');
      });

      it("should delete metadata from the workspace, ", function () {
        workspacePage.deleteResourceNew(sampleTitle, 'metadata');
      });

      it("should delete template from the workspace, ", function () {
        workspacePage.deleteResourceNew('*', 'template');
      });

      it("should delete metadata from the workspace, ", function () {
        workspacePage.deleteResourceNew('*', 'metadata');
      });

    })
    (j);
  }

});

