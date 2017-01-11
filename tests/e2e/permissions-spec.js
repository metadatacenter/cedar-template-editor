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
    workspacePage.clickLogo();
  });


  it("should move a folder owned by current user to a writable folder", function () {
    // create source folder
    sourceFolderTitle = workspacePage.createTitle('Source');
    workspacePage.createResource('folder', sourceFolderTitle);
    toastyModal.isSuccess();

    // create target folder
    targetFolderTitle = workspacePage.createTitle('Target');
    workspacePage.createResource('folder', targetFolderTitle);
    toastyModal.isSuccess();

    // move source to target folder
    workspacePage.moveResource(sourceFolderTitle, 'folder');
    moveModal.moveToDestination(targetFolderTitle);
    toastyModal.isSuccess();
  });


  it("should move a folder owned by current user to an un-writable folder", function () {
    // create a folder to share with another user
    sharedFolderTitle = workspacePage.createTitle('Shared');
    workspacePage.createResource('folder', sharedFolderTitle);
    toastyModal.isSuccess();

    // share folder
    shareResource(sharedFolderTitle, 'folder', testUserName2, false);

    // logout current user and login as the user with whom the folder was shared
    logout();
    login(testConfig.testUser2, testConfig.testPassword2);

    // create a folder to move to the shared folder
    var folderTitle = workspacePage.createTitle('Source');
    workspacePage.createResource('folder', folderTitle);
    toastyModal.isSuccess();

    // move created folder to shared folder
    workspacePage.moveResource(folderTitle, 'folder');
    moveModal.moveToUserFolder(testUserName1, sharedFolderTitle);
    toastyModal.isError();
  });


  it("should move a writable folder not owned by current user to a writable folder", function () {
    // create source shared folder
    var sourceFolder = workspacePage.createTitle('Source');
    workspacePage.createResource('folder', sourceFolder);
    toastyModal.isSuccess();

    // create target shared folder
    var targetFolder = workspacePage.createTitle('Target');
    workspacePage.createResource('folder', targetFolder);
    toastyModal.isSuccess();

    // share both folders
    shareResource(sourceFolder, 'folder', testUserName1, true);
    browser.sleep(2000);
    workspacePage.clickLogo(); // reset search
    browser.sleep(1000);
    shareResource(targetFolder, 'folder', testUserName1, true); // TODO fails because of refresh issue #273 (when this resource is about to be shared, the view shows the sharing options for the previously created folder...)

    logout();
    login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    goToUserFolder(testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(testUserName2, targetFolder);
    toastyModal.isSuccess();
  });


  it("should move a writable folder not owned by current user to an unwritable folder", function () {
    // create source shared folder
    var sourceFolder = workspacePage.createTitle('Source');
    workspacePage.createResource('folder', sourceFolder);
    toastyModal.isSuccess();

    // create target shared folder
    var targetFolder = workspacePage.createTitle('Target');
    workspacePage.createResource('folder', targetFolder);
    toastyModal.isSuccess();

    shareResource(sourceFolder, 'folder', testUserName2, true);
    browser.sleep(2000);
    workspacePage.clickLogo(); // reset search
    shareResource(targetFolder, 'folder', testUserName2, false); // TODO fails because of refresh issue #273

    logout();
    login(testConfig.testUser2, testConfig.testPassword2);
    goToUserFolder(testUserName1);

    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isError();
  });


  it("should move an unwritable folder not owned by current user to an unwritable folder", function () {
    // TODO
  });


  it("should delete test resources", function () {
    logout();
    login(testConfig.testUser1, testConfig.testPassword1);
    deleteResource(targetFolderTitle, 'folder');
    deleteResource(sharedFolderTitle, 'folder');
  });


  /* auxiliary functions */

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


  function shareResource(name, type, username, canWrite) {
    workspacePage.selectResource(name, type);
    workspacePage.createMoreOptionsButton().click();
    var shareMenuItem = workspacePage.createShareMenuItem();
    browser.wait(EC.elementToBeClickable(shareMenuItem));
    shareMenuItem.click();

    var usernameField = workspacePage.createShareModalUserName();
    usernameField.sendKeys(username);
    browser.actions().sendKeys(protractor.Key.ENTER).perform();

    if (canWrite) {
      var permissionsList = workspacePage.createShareModalPermissions();
      permissionsList.click();
      workspacePage.createShareModalWritePermission().click();
    }

    var addButton = workspacePage.createShareModalAddUserButton();
    browser.wait(EC.elementToBeClickable(addButton));
    addButton.click();

    var doneButton = workspacePage.createShareModalDoneButton();
    browser.wait(EC.elementToBeClickable(doneButton));
    doneButton.click();
  }


  function deleteResource(name, type) {
    workspacePage.selectResource(name, type);
    workspacePage.createTrashButton().click();
    sweetAlertModal.confirm();
    toastyModal.isSuccess();
    browser.sleep(1000);
    workspacePage.clickLogo();
  }


  function goToUserFolder(username) {
    workspacePage.clickBreadcrumb(1);
    var centerPanel = element(by.id('center-panel'));
    var f = centerPanel.element(by.cssContainingText('.folderTitle.ng-binding', username));
    browser.actions().doubleClick(f).perform();
  }

});


