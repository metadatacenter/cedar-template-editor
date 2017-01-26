'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');

var _ = require('../libs/lodash.min.js');
var sampleTitle;
var sampleTemplateTitle;
var sampleDescription;
var sampleTemplateUrl;
var sampleMetadataUrl;
var pageName = 'template';

describe('workspace', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var workspacePage;
  var templatePage;
  var toastyModal;
  var sweetAlertModal;
  var moveModal;

  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {

    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    moveModal = MoveModal;
    browser.driver.manage().window().maximize();

  });

  afterEach(function () {
  });

  it("should have a logo", function () {

    browser.wait(EC.presenceOf(workspacePage.createLogo()));

  });

  for (var j = 0; j < 1; j++) {
    (function () {

      // functioning trash and options buttons
      it("should create a folder", function () {

        sampleTitle = workspacePage.createTitle('folder');

        // create the folder
        workspacePage.createResource('folder', sampleTitle);
        toastyModal.isSuccess();

      });

      // functioning trash and options buttons
      it("should have trash and options buttons hidden, search, breadcrumbs, and create buttons visible", function () {

        browser.wait(EC.invisibilityOf(workspacePage.createTrashButton()));
        browser.wait(EC.invisibilityOf(workspacePage.createMoreOptionsButton()));

        browser.wait(EC.visibilityOf(workspacePage.createSearchNav()));
        workspacePage.createSearchNavInput().getText().then(function (value) {
          expect(value).toBe('');
        });

        browser.wait(EC.visibilityOf(workspacePage.createBreadcrumb()));
        browser.wait(EC.visibilityOf(workspacePage.createButton()));

      });

      xit("should open the folder in the bread crumb", function () {

        workspacePage.clickBreadcrumb(1);
        workspacePage.clickLogo();

      });

      // functioning trash and options buttons
      it("should have trash and options button visible if folder is selected", function () {

        browser.wait(EC.elementToBeClickable(workspacePage.createFirstFolder()));
        workspacePage.createFirstFolder().click();

        expect(workspacePage.createTrashButton().isPresent()).toBe(true);
        expect(workspacePage.createMoreOptionsButton().isPresent()).toBe(true);

      });

      it("should create a sample template", function () {

        sampleTemplateTitle = workspacePage.createTitle('template');

        // create a template
        workspacePage.createResource( 'template', sampleTemplateTitle);
        templatePage.setTitle('template', sampleTemplateTitle);
        templatePage.clickSave('template');

        // go back to the workspace
        templatePage.topNavBackArrow().click();


      });

      // TODO not working on Travis
      //  timeout: timed out after 100000 msec waiting for spec to complete
      xit("should move the template into the sample folder", function () {

        // now move the template into the sample folder
        workspacePage.moveResource(sampleTemplateTitle, 'template');
        moveModal.moveToDestination(sampleTitle);
        toastyModal.isSuccess();

        workspacePage.clickLogo();

      });

      it("should delete the sample folder", function () {

        workspacePage.deleteResource(sampleTitle, 'folder');
        sweetAlertModal.confirm();
        toastyModal.isSuccess();
        workspacePage.clickLogo();

      });

    })
    (j);
  }

});


