'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var MoveModal = require('../modals/move-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var ShareModal = require('../modals/share-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var testConfig = require('../config/test-env.js');

describe('folder-permissions', function () {
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var copyModal = CopyModal;
  var shareModal = ShareModal;
  var sweetAlertModal = SweetAlertModal;

  var resourcesUser1 = [];
  var resourcesUser2 = [];

  beforeEach(function () {
  });

  afterEach(function () {
  });


  /* move tests */

  it("should move a folder owned by current user to a writable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    // create source and target folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');
    resourcesUser1.push(sourceFolder);
    resourcesUser1.push(targetFolder);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isSuccess();
    workspacePage.clickLogo();
  });


  it("should move a folder owned by current user to an unwritable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    // create a folder to share with another user
    var sharedFolderTitle = workspacePage.createFolder('Shared');
    resourcesUser1.push(sharedFolderTitle);

    // share folder
    shareModal.shareResource(sharedFolderTitle, 'folder', testConfig.testUserName2, false, false);

    // logout current user and login as the user with whom the folder was shared
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    // create a folder to move to the shared folder
    var folderTitle = workspacePage.createFolder('Source');
    resourcesUser2.push(folderTitle);

    // move created folder to shared folder
    workspacePage.moveResource(folderTitle, 'folder');
    moveModal.moveToUserFolder(testConfig.testUserName1, sharedFolderTitle);
    sweetAlertModal.hasInsufficientPermissions();
    sweetAlertModal.confirm();
    workspacePage.clickLogo();
  });


  it("should move a writable folder not owned by current user to a writable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');
    resourcesUser2.push(sourceFolder);
    resourcesUser2.push(targetFolder);

    // share both folders
    shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, true, false);
    workspacePage.clearSearch(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testConfig.testUserName2);

    // move source to target folder
    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    toastyModal.isSuccess();
    workspacePage.clickLogo();
  });


  it("should move a writable folder not owned by current user to an unwritable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');
    resourcesUser1.push(sourceFolder);
    resourcesUser1.push(targetFolder);

    shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName2, true, false);
    workspacePage.clearSearch(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.navigateToUserFolder(testConfig.testUserName1);

    workspacePage.moveResource(sourceFolder, 'folder');
    moveModal.moveToDestination(targetFolder);
    sweetAlertModal.hasInsufficientPermissions();
    sweetAlertModal.confirm();
    workspacePage.clickLogo();
  });


  it("should move an unwritable folder not owned by current user to an unwritable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');
    resourcesUser2.push(sourceFolder);
    resourcesUser2.push(targetFolder);

    // share both folders
    shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, false, false);
    workspacePage.clearSearch(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testConfig.testUserName2);

    // move source to target folder
    workspacePage.rightClickResource(sourceFolder, 'folder');
    expect(workspacePage.createRightClickMoveToMenuItem().getAttribute('class')).toMatch('link-disabled');
    workspacePage.clickLogo();
  });


  /* copy tests */

  xit("should copy a folder owned by current user to a writable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    // create source and target folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');
    resourcesUser1.push(sourceFolder);
    resourcesUser1.push(targetFolder);

    // copy source to target folder
    workspacePage.copyResource(sourceFolder, 'folder');
    copyModal.copyToDestination(targetFolder);
    toastyModal.isSuccess();
    resourcesUser1.push(sourceFolder);
    workspacePage.clickLogo();
  });


  xit("should copy a folder owned by current user to an unwritable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    // create a folder to share with another user
    var sharedFolderTitle = workspacePage.createFolder('Shared');
    resourcesUser1.push(sharedFolderTitle);

    // share folder
    shareModal.shareResource(sharedFolderTitle, 'folder', testConfig.testUserName2, false, false);

    // logout current user and login as the user with whom the folder was shared
    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

    // create a folder to move to the shared folder
    var folderTitle = workspacePage.createFolder('Source');
    resourcesUser2.push(folderTitle);

    // copy created folder to shared folder
    workspacePage.copyResource(folderTitle, 'folder');
    copyModal.copyToUserFolder(testConfig.testUserName1, sharedFolderTitle);
    sweetAlertModal.hasInsufficientPermissions();
    sweetAlertModal.confirm();
    workspacePage.clickLogo();
  });


  xit("should copy a writable folder not owned by current user to a writable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');
    resourcesUser2.push(sourceFolder);
    resourcesUser2.push(targetFolder);

    // share both folders
    shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, true, false);
    workspacePage.clearSearch(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, true, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testConfig.testUserName2);

    // copy source to target folder
    workspacePage.copyResource(sourceFolder, 'folder');
    copyModal.copyToDestination(targetFolder);
    toastyModal.isSuccess();
    resourcesUser2.push(sourceFolder);
    workspacePage.clickLogo();
  });


  xit("should copy a writable folder not owned by current user to an unwritable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);

    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');
    resourcesUser1.push(sourceFolder);
    resourcesUser1.push(targetFolder);

    shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName2, true, false);
    workspacePage.clearSearch(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName2, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    workspacePage.navigateToUserFolder(testConfig.testUserName1);

    workspacePage.copyResource(sourceFolder, 'folder');
    copyModal.copyToDestination(targetFolder);
    sweetAlertModal.hasInsufficientPermissions();
    sweetAlertModal.confirm();
    workspacePage.clickLogo();
  });


  xit("should copy an unwritable folder not owned by current user to an unwritable folder", function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);

    // create source and target shared folders
    var sourceFolder = workspacePage.createFolder('Source');
    var targetFolder = workspacePage.createFolder('Target');
    resourcesUser2.push(sourceFolder);
    resourcesUser2.push(targetFolder);

    // share both folders
    shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, false, false);
    workspacePage.clearSearch(); // reset search
    shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, false, false);

    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

    // go to Test User 2's folder to see the shared folders
    workspacePage.navigateToUserFolder(testConfig.testUserName2);

    // copy source to target folder
    workspacePage.rightClickResource(sourceFolder, 'folder');
    expect(workspacePage.createRightClickCopyToMenuItem().getAttribute('class')).toMatch('link-disabled');
    workspacePage.clickLogo();
  });


  it("should delete the test resources created by " + testConfig.testUserName1, function () {
    workspacePage.loginIfNecessary(testConfig.testUserName1, testConfig.testUser1, testConfig.testPassword1);
    for (var i = 0; i < resourcesUser1.length; i++) {
      workspacePage.deleteResourceViaRightClick(resourcesUser1[i], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
  });


  it("should delete the test resources created by " + testConfig.testUserName2, function () {
    workspacePage.loginIfNecessary(testConfig.testUserName2, testConfig.testUser2, testConfig.testPassword2);
    for(var j = 0; j < resourcesUser2.length; j++) {
      workspacePage.deleteResourceViaRightClick(resourcesUser2[j], 'folder');
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    }
    workspacePage.logout();
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
  });


});


