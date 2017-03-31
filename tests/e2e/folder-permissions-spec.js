'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');


var _ = require('../libs/lodash.min.js');

describe('folder-permissions', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var shareModal = ShareModal;
  var copyModal = CopyModal;
  var sweetAlertModal = SweetAlertModal;
  var resources = {'user1': [], 'user2': []};


  beforeEach(function () {
  });

  afterEach(function () {
  });

  describe('moving folders', function () {

    it("should move a folder owned by current user to a writable folder", function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source and target folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // move source to target folder
      workspacePage.moveResource(sourceFolder, 'folder');
      moveModal.moveToDestination(targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      // delete these at the end
      resources['user1'].push(sourceFolder);
      resources['user1'].push(targetFolder);
    });

    it("should move a folder owned by current user to an unwritable folder", function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // share folder with user 2
      var sharedFolderTitle = workspacePage.createFolder('Shared');
      shareModal.shareResource(sharedFolderTitle, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch(); // reset search

      // login as user 2
      workspacePage.logout();
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create a folder to move to the shared folder
      var folderTitle = workspacePage.createFolder('Source');
      workspacePage.moveResource(folderTitle, 'folder');
      moveModal.moveToUserFolder(testConfig.testUserName1, sharedFolderTitle);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      // delete these at the end
      resources['user1'].push(sharedFolderTitle);
      resources['user2'].push(folderTitle);
    });


    it("should move a writable folder not owned by current user to a writable folder", function () {
      // login as user 2
      workspacePage.logout();
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // move source to target folder
      workspacePage.moveResource(sourceFolder, 'folder');
      moveModal.moveToDestination(targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      resources['user2'].push(sourceFolder);
      resources['user2'].push(targetFolder);
    });

    it("should move a writable folder not owned by current user to an unwritable folder", function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName2, true, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.logout();
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      workspacePage.moveResource(sourceFolder, 'folder');
      moveModal.moveToDestination(targetFolder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      resources['user1'].push(sourceFolder);
      resources['user1'].push(targetFolder);
    });

    it("should move an unwritable folder not owned by current user to an unwritable folder", function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // move source to target folder
      workspacePage.rightClickResource(sourceFolder, 'folder');
      expect(workspacePage.createRightClickMoveToMenuItem().getAttribute('class')).toMatch('link-disabled');
      workspacePage.clearSearch();

      resources['user2'].push(sourceFolder);
      resources['user2'].push(targetFolder);
    });

  });

  // TODO copying folders is not currently allowed
  xdescribe('copy folders', function () {

    it("should copy a folder owned by current user to a writable folder", function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source and target folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // copy source to target folder
      workspacePage.copyResource(sourceFolder, 'folder');
      copyModal.copyToDestination(targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      resources['user1'].push(sourceFolder);
      resources['user1'].push(targetFolder);
    });

    it("should copy a folder owned by current user to an unwritable folder", function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create a folder to share with another user
      var sharedFolderTitle = workspacePage.createFolder('Shared');
      shareModal.shareResource(sharedFolderTitle, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch(); // reset search

      // logout current user and login as the user with whom the folder was shared
      workspacePage.logout();
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create a folder to move to the shared folder
      var folderTitle = workspacePage.createFolder('Source');
      workspacePage.copyResource(folderTitle, 'folder');
      copyModal.copyToUserFolder(testConfig.testUserName1, sharedFolderTitle);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      resources['user1'].push(sharedFolderTitle);
      resources['user2'].push(folderTitle);
    });

    it("should copy a writable folder not owned by current user to a writable folder", function () {
      // logout current user and login as the user with whom the folder was shared
      workspacePage.logout();
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // copy source to target folder
      workspacePage.copyResource(sourceFolder, 'folder');
      copyModal.copyToDestination(targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      resources['user2'].push(sourceFolder);
      resources['user2'].push(targetFolder);
    });

    it("should copy a writable folder not owned by current user to an unwritable folder", function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName2, true, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.logout();
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);

      workspacePage.copyResource(sourceFolder, 'folder');
      copyModal.copyToDestination(targetFolder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      resources['user1'].push(sourceFolder);
      resources['user1'].push(targetFolder);
    });

    it("should copy an unwritable folder not owned by current user to an unwritable folder", function () {
      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // copy source to target folder
      workspacePage.rightClickResource(sourceFolder, 'folder');
      expect(workspacePage.createRightClickCopyToMenuItem().getAttribute('class')).toMatch('link-disabled');
      workspacePage.clearSearch();

      resources['user2'].push(sourceFolder);
      resources['user2'].push(targetFolder);
    });
  });

  describe('remove created resources', function () {

    it("should login as " + testConfig.testUserName1, function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    });

    it('should delete any template from the user workspace', function () {
      for (var i = 0; i < resources['user1'].length; i++) {
        (function (resource) {
          workspacePage.deleteResourceViaRightClick(resource, 'folder');
          toastyModal.isSuccess();
          workspacePage.clearSearch();
        })
        (resources['user1'][i]);
      }
    });

    it("should login as " + testConfig.testUserName2, function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    });

    it('should delete any template from the user workspace', function () {
      for (var i = 0; i < resources['user2'].length; i++) {
        (function (resource) {
          workspacePage.deleteResourceViaRightClick(resource, 'folder');
          toastyModal.isSuccess();
          workspacePage.clearSearch();
        })
        (resources['user2'][i]);
      }
    });

    it("should login as " + testConfig.testUserName1, function () {
      workspacePage.logout();
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    });
  });


});


