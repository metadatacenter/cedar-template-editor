'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');

var testUserName1 = 'Test User 1';
var testUserName2 = 'Test User 2';

describe('folder-permissions', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage;
  var toastyModal;
  var sweetAlertModal;
  var moveModal;
  var shareModal;

  beforeEach(function () {
    workspacePage = WorkspacePage;
    toastyModal = ToastyModal;
    sweetAlertModal = SweetAlertModal;
    moveModal = MoveModal;
    shareModal = ShareModal;
    browser.driver.manage().window().maximize();

    console.log(jasmine.getEnv().currentSpec.description);
  });

  afterEach(function () {
    workspacePage.clickLogo();
  });


  it("should move a folder owned by current user to a writable folder", function () {
    // create source and target folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isSuccess();

    workspacePage.clickLogo();
    workspacePage.deleteResource(targetFolder, 'folder');
  });


  it("should move a folder owned by current user to an unwritable folder", function () {
    // create a folder to share with another user
    var sharedFolderTitle = workspacePage.createFolder('Shared');

    // share folder
    shareModal.shareResource(sharedFolderTitle, 'folder', testUserName2, false, false);

    // logout current user and login as the user with whom the folder was shared
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    // create a folder to move to the shared folder
    var folderTitle = workspacePage.createFolder('Source');

    // move created folder to shared folder
    workspacePage.moveResource(folderTitle, 'folder');
    moveModal.moveToUserFolder(testUserName1, sharedFolderTitle);
    toastyModal.isError();

    // delete folder
    workspacePage.clickLogo();
    workspacePage.deleteResource(folderTitle, 'folder');
  });


  it("should move a writable folder not owned by current user to a writable folder", function () {
    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // share both folders
    shareModal.shareResource(sourceFolder, 'folder', testUserName1, true, false);
    browser.wait(EC.invisibilityOf(shareModal.createShareModal()));
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isSuccess();
  });


  it("should move a writable folder not owned by current user to an unwritable folder", function () {
    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');

    shareModal.shareResource(sourceFolder, 'folder', testUserName2, true, false);
    browser.wait(EC.invisibilityOf(shareModal.createShareModal()));
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.navigateToUserFolder(testUserName1);

    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isError();
  });


  it("should move an unwritable folder not owned by current user to an unwritable folder", function () {
    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // share both folders
    shareModal.shareResource(sourceFolder, 'folder', testUserName1, false, false);
    browser.wait(EC.invisibilityOf(shareModal.createShareModal()));
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testUserName1, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isError();
  });


});


