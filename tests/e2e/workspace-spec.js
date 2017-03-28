'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');

var _ = require('../libs/lodash.min.js');
var sampleFolderTitle;
var sampleTemplateTitle;

describe('workspace', function () {
  var EC = protractor.ExpectedConditions;

  var workspacePage = WorkspacePage;
  var metadataPage = MetadataPage;
  var templatePage = TemplatePage;
  var toastyModal = ToastyModal;
  var sweetAlertModal = SweetAlertModal;
  var moveModal = MoveModal;

  // before each test, load a new page and create a template
  // maximize the window area for clicking
  beforeEach(function () {
    workspacePage.appLoaded();
  });

  afterEach(function () {
  });

  it("should have a logo", function () {
    workspacePage.onWorkspace();
    workspacePage.hasLogo();
  });

  for (var j = 0; j < 1; j++) {
    (function () {

      // functioning trash and options buttons
      it("should create a folder", function () {
        sampleFolderTitle = workspacePage.createTitle('folder');
        workspacePage.createResource('folder', sampleFolderTitle);
        toastyModal.isSuccess();
      });

      it("should have search visible and empty", function () {
        browser.wait(EC.visibilityOf(workspacePage.createSearchNav()));
        workspacePage.createSearchNavInput().getText().then(function (value) {
          expect(value).toBe('');
        });
      });

      it("should have breadcrumb visible and empty", function () {
        browser.wait(EC.visibilityOf(workspacePage.createBreadcrumb()));
      });

      it("should have create button visible and empty", function () {
        browser.wait(EC.visibilityOf(workspacePage.createButton()));
      });

      // functioning trash and options buttons
      it("should have more options button visible if folder is selected", function () {
        browser.wait(EC.elementToBeClickable(workspacePage.createFirstFolder()));
        workspacePage.createFirstFolder().click();
        expect(workspacePage.createMoreOptionsButton().isPresent()).toBe(true);
      });

      it("should create a sample template", function () {
        sampleTemplateTitle = workspacePage.createTitle('template');
        workspacePage.createResource( 'template', sampleTemplateTitle, "sample description");
        workspacePage.onWorkspace();
      });

      // TODO not working on Travis
      //  timeout: timed out after 100000 msec waiting for spec to complete
      xit("should move the template into the sample folder", function () {
        workspacePage.moveResource(sampleTemplateTitle, 'template');
        moveModal.moveToDestination(sampleFolderTitle);
        toastyModal.isSuccess();
        workspacePage.clickLogo();
      });

      it("should open the folder in the bread crumb", function () {
        workspacePage.clickBreadcrumb(1);
        workspacePage.clickLogo();
      });

      it("should delete the sample template", function () {
        workspacePage.deleteResource(sampleTemplateTitle, 'template');
        workspacePage.onWorkspace();
      });

      // TODO does not work for some reason
      it("should delete the sample folder", function () {
        workspacePage.deleteResource(sampleFolderTitle, 'folder');
        workspacePage.onWorkspace();
      });


    })
    (j);
  }

});


