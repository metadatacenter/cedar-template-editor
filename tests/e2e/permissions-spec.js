'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var testConfig = require('../config/test-env.js');

var sourceFolderTitle;
var targetFolderTitle;
var sharedFolderTitle;

var testUserName1 = 'Test User 1';
var testUserName2 = 'Test User 2';

describe('permissions', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage;
  var toastyModal;
  var sweetAlertModal;
  var moveModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
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

      it("should move a folder owned by current user to a writable folder", function () {
        // create source folder
        sourceFolderTitle = workspacePage.createTitle('source-folder');
        workspacePage.createResource('folder', sourceFolderTitle);
        toastyModal.isSuccess();

        // create target folder
        targetFolderTitle = workspacePage.createTitle('target-folder');
        workspacePage.createResource('folder', targetFolderTitle);
        toastyModal.isSuccess();

        // move source to target folder
        workspacePage.moveResource(sourceFolderTitle, 'folder');
        moveModal.moveToDestination(targetFolderTitle);
        toastyModal.isSuccess();
        workspacePage.clickLogo();
      });


      it("should move a folder owned by current user to an un-writable folder", function() {
        // create a folder to share with another user
        sharedFolderTitle = workspacePage.createTitle('shared-folder');
        workspacePage.createResource('folder', sharedFolderTitle);
        toastyModal.isSuccess();

        // share folder
        shareResource(sharedFolderTitle, 'folder', testUserName2);

        // logout current user and login as the user with whom the folder was shared
        logout();
        login(testConfig.testUser2, testConfig.testPassword2);

        // create a folder to move to the shared folder
        var folderTitle = workspacePage.createTitle('source-folder');
        workspacePage.createResource('folder', folderTitle);
        toastyModal.isSuccess();

        // move created folder to shared folder
        workspacePage.moveResource(folderTitle, 'folder');
        moveModal.moveToDestination(sharedFolderTitle);
        toastyModal.isSuccess();
      });


      it("should move a writable folder not owned by current user to a writable folder", function() {
        // create source shared folder
        var sourceFolder = workspacePage.createTitle('source-shared-folder');
        workspacePage.createResource('folder', sourceFolder);
        toastyModal.isSuccess();

        // create target folder
        var targetFolder = workspacePage.createTitle('target-shared-folder');
        workspacePage.createResource('folder', targetFolder);
        toastyModal.isSuccess();

        shareResource(sourceFolder, 'folder', testUserName1);
        browser.sleep(1000);
        workspacePage.clickLogo(); // reset search
        shareResource(targetFolder, 'folder', testUserName1);

        logout();
        login(testConfig.testUser1, testConfig.testPassword1);

        workspacePage.moveResource(sourceFolder, 'folder');
        moveModal.moveToDestination(targetFolder);
        toastyModal.isSuccess();
      });


      function logout() {
        browser.sleep(1000);
        var createUserDropdownButton = workspacePage.createUserDropdownButton();
        browser.wait(EC.elementToBeClickable(createUserDropdownButton));
        createUserDropdownButton.click();
        var logoutMenuItem = workspacePage.createLogoutMenuItem();
        browser.wait(EC.elementToBeClickable(logoutMenuItem));
        logoutMenuItem.click();
      }


      function login(username, password) {
        browser.driver.findElement(by.id('username')).sendKeys(username).then(function () {
          browser.driver.findElement(by.id('password')).sendKeys(password).then(function () {
            browser.driver.findElement(by.id('kc-login')).click().then(function () {
              browser.driver.wait(browser.driver.isElementPresent(by.id('top-navigation')));
              browser.driver.wait(browser.driver.isElementPresent(by.className('ng-app')));
            });
          });
        });
      }

      function shareResource(name, type, username) {
        workspacePage.selectResource(name, type);
        workspacePage.createMoreOptionsButton().click();
        var shareMenuItem = workspacePage.createShareMenuItem();
        browser.wait(EC.elementToBeClickable(shareMenuItem));
        shareMenuItem.click();

        var usernameField = workspacePage.createShareModalUserName();
        usernameField.sendKeys(username);
        browser.actions().sendKeys(protractor.Key.ENTER).perform();

        var addButton = workspacePage.createShareModalAddUserButton();
        browser.wait(EC.elementToBeClickable(addButton));
        addButton.click();

        var doneButton = workspacePage.createShareModalDoneButton();
        browser.wait(EC.elementToBeClickable(doneButton));
        doneButton.click();
      }

    })
    (j);
  }

});


