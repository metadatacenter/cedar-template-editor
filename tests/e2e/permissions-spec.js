'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var MetadataPage = require('../pages/metadata-page.js');
var TemplatePage = require('../pages/template-creator-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var testConfig = require('../config/test-env.js');

var sourceFolderTitle;
var targetFolderTitle;

describe('permissions', function () {
  var EC = protractor.ExpectedConditions;
  var metadataPage;
  var workspacePage;
  var templatePage;
  var toastyModal;
  var sweetAlertModal;
  var moveModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
    metadataPage = MetadataPage;
    templatePage = TemplatePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    moveModal = MoveModal;
    browser.driver.manage().window().maximize();

    console.log(jasmine.getEnv().currentSpec.description);
  });

  afterEach(function () {
  });

  for (var j = 0; j < 1; j++) {
    (function () {

      it("should create 2 folders", function () {
        sourceFolderTitle = workspacePage.createTitle('source-folder');
        workspacePage.createResource('folder', sourceFolderTitle);
        toastyModal.isSuccess();

        targetFolderTitle = workspacePage.createTitle('target-folder');
        workspacePage.createResource('folder', targetFolderTitle);
        toastyModal.isSuccess();
      });

      it("should move a folder owned by current user into a writable folder", function () {
        workspacePage.moveResource(sourceFolderTitle, 'folder');
        moveModal.moveToDestination(targetFolderTitle);
        toastyModal.isSuccess();
        workspacePage.clickLogo();
      });

      it("should share a folder with Test User 2", function() {
        workspacePage.selectResource(targetFolderTitle);
        workspacePage.createMoreOptionsButton().click();
        var shareMenuItem = workspacePage.createShareMenuItem();
        browser.wait(EC.elementToBeClickable(shareMenuItem));
        shareMenuItem.click();
        // TODO share with test user 2
      });

      it("should logout Test User 1", function() {
        workspacePage.createUserDropdownButton().click();
        var logoutMenuItem = workspacePage.createLogoutMenuItem();
        browser.wait(EC.elementToBeClickable(logoutMenuItem));
        logoutMenuItem.click();
      });

      it("should login as Test User 2", function() {
        browser.driver.findElement(by.id('username')).sendKeys(testConfig.testUser2).then(function () {
          browser.driver.findElement(by.id('password')).sendKeys(testConfig.testPassword2).then(function () {
            browser.driver.findElement(by.id('kc-login')).click().then(function () {
              browser.driver.wait(browser.driver.isElementPresent(by.id('top-navigation')));
            });
          });
        });
      });

    })
    (j);
  }

});


