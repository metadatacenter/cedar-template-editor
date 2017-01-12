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

    workspacePage.deleteResource(targetFolderTitle, 'folder');
  });


  it("should move a folder owned by current user to an unwritable folder", function () {
    // create a folder to share with another user
    sharedFolderTitle = workspacePage.createTitle('Shared');
    workspacePage.createResource('folder', sharedFolderTitle);
    toastyModal.isSuccess();

    // share folder
    workspacePage.shareResource(sharedFolderTitle, 'folder', testUserName2, false);

    // logout current user and login as the user with whom the folder was shared
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    // create a folder to move to the shared folder
    var folderTitle = workspacePage.createTitle('Source');
    workspacePage.createResource('folder', folderTitle);
    toastyModal.isSuccess();

    // move created folder to shared folder
    workspacePage.moveResource(folderTitle, 'folder');
    moveModal.moveToUserFolder(testUserName1, sharedFolderTitle);
    toastyModal.isError();

    // delete folder
    workspacePage.deleteResource(folderTitle, 'folder');
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
    workspacePage.shareResource(sourceFolder, 'folder', testUserName1, true);
    browser.sleep(2000);
    workspacePage.clickLogo(); // reset search
    workspacePage.shareResource(targetFolder, 'folder', testUserName1, true); // TODO fails because of refresh issue #273 (when this resource is about to be shared, the view shows the sharing options for the previously created folder...)

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testUserName2);

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

    workspacePage.shareResource(sourceFolder, 'folder', testUserName2, true);
    browser.sleep(2000);
    workspacePage.clickLogo(); // reset search
    workspacePage.shareResource(targetFolder, 'folder', testUserName2, false); // TODO fails because of refresh issue #273

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.navigateToUserFolder(testUserName1);

    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isError();
  });


  it("should move an unwritable folder not owned by current user to an unwritable folder", function () {
    // create source shared folder
    var sourceFolder = workspacePage.createTitle('Source');
    workspacePage.createResource('folder', sourceFolder);
    toastyModal.isSuccess();

    // create target shared folder
    var targetFolder = workspacePage.createTitle('Target');
    workspacePage.createResource('folder', targetFolder);
    toastyModal.isSuccess();

    // share both folders
    workspacePage.shareResource(sourceFolder, 'folder', testUserName1, false);
    browser.sleep(2000);
    workspacePage.clickLogo(); // reset search
    workspacePage.shareResource(targetFolder, 'folder', testUserName1, false); // TODO fails because of refresh issue #273

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(testUserName2, targetFolder);
    toastyModal.isError();
  });

});


