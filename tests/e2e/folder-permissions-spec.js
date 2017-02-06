'use strict';
var WorkspacePage = require('../pages/workspace-new-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var testConfig = require('../config/test-env.js');
var permissions = require('../config/permissions.js');

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
  });


  it("should move a folder owned by current user to an unwritable folder", function () {
    console.log("creating shared folder");
    // create a folder to share with another user
    var sharedFolderTitle = workspacePage.createFolder('Shared');
    console.log("sharing folder");

    // share folder
    shareModal.shareResource(sharedFolderTitle, 'folder', permissions.testUserName2, false, false);

    console.log("logging out");
    // logout current user and login as the user with whom the folder was shared
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    console.log("create folder");
    // create a folder to move to the shared folder
    var folderTitle = workspacePage.createFolder('Source');

    console.log("move resource");
    // move created folder to shared folder
    workspacePage.moveResource(folderTitle, 'folder');
    console.log("move to user folder");
    moveModal.moveToUserFolder(permissions.testUserName1, sharedFolderTitle);
    console.log("check if toasty is error");
    toastyModal.isError();
  });


  it("should move a writable folder not owned by current user to a writable folder", function () {
    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // share both folders
    shareModal.shareResource(sourceFolder, 'folder', permissions.testUserName1, true, false);
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', permissions.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(permissions.testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isSuccess();
  });


  it("should move a writable folder not owned by current user to an unwritable folder", function () {
    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');

    shareModal.shareResource(sourceFolder, 'folder', permissions.testUserName2, true, false);
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', permissions.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.navigateToUserFolder(permissions.testUserName1);

    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isError();
  });


  it("should move an unwritable folder not owned by current user to an unwritable folder", function () {
    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');

    // share both folders
    shareModal.shareResource(sourceFolder, 'folder', permissions.testUserName1, false, false);
    workspacePage.clickLogo(); // reset search
    shareModal.shareResource(targetFolder, 'folder', permissions.testUserName1, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(permissions.testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isError();
  });


});


