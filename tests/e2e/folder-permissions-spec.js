'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');


var _ = require('../libs/lodash.min.js');

// TODO this is similar to resource-permissions so turn turn this off to save time
describe('folder-permissions', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var shareModal = ShareModal;
  var copyModal = CopyModal;
  var sweetAlertModal = SweetAlertModal;

  var resources = [];
  var createResource = function (title, type, username, password) {
    var result = new Object;
    result.title = title;
    result.type = type;
    result.username = username;
    result.password = password;
    return result;
  };

  beforeEach(function () {
  });

  afterEach(function () {
  });

  // reset user selections to defaults
  it('should be on the workspace', function () {
    console.log('folder-permissions should be on the workspace');
    workspacePage.onWorkspace();
  });

  describe('moving folders', function () {

    it("should move a folder owned by current user to a writable folder", function () {
      console.log('folder-permissions moving folders should move a folder owned by current user to a writable folder');
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
      resources.push(createResource(sourceFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));

    });

    it("should move a folder owned by current user to an unwritable folder", function () {
      console.log('folder-permissions moving folders should move a folder owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // share folder with user 2
      var sharedFolderTitle = workspacePage.createFolder('Shared');
      shareModal.shareResource(sharedFolderTitle, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      // login as user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create a folder to move to the shared folder
      var folderTitle = workspacePage.createFolder('Source');
      workspacePage.moveResource(folderTitle, 'folder');
      moveModal.moveToUserFolder(testConfig.testUserName1, sharedFolderTitle);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sharedFolderTitle, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(folderTitle, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should move a writable folder not owned by current user to a writable folder", function () {
      console.log('folder-permissions moving folders should move a writable folder not owned by current user to a writable folder');
      // login as user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // move source to target folder
      workspacePage.moveResource(sourceFolder, 'folder');
      moveModal.moveToDestination(targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sourceFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should move a writable folder not owned by current user to an unwritable folder", function () {
      console.log('folder-permissions moving folders should move a writable folder not owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName2, true, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      workspacePage.moveResource(sourceFolder, 'folder');
      moveModal.moveToDestination(targetFolder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sourceFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should move an unwritable folder not owned by current user to an unwritable folder", function () {
      console.log('folder-permissions moving folders should move an unwritable folder not owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // move source to target folder
      workspacePage.rightClickResource(sourceFolder, 'folder');
      expect(workspacePage.createRightClickMoveToMenuItem().getAttribute('class')).toMatch('link-disabled');
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sourceFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

  });

  // TODO copying folders is not currently allowed
  xdescribe('copy folders', function () {

    it("should copy a folder owned by current user to a writable folder", function () {
      console.log('folder-permissions copy folders should copy a folder owned by current user to a writable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source and target folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // copy source to target folder
      workspacePage.copyResource(sourceFolder, 'folder');
      copyModal.copyToDestination(targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sourceFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should copy a folder owned by current user to an unwritable folder", function () {
      console.log('folder-permissions copy folders should copy a folder owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create a folder to share with another user
      var sharedFolderTitle = workspacePage.createFolder('Shared');
      shareModal.shareResource(sharedFolderTitle, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch(); // reset search

      // logout current user and login as the user with whom the folder was shared
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create a folder to move to the shared folder
      var folderTitle = workspacePage.createFolder('Source');
      workspacePage.copyResource(folderTitle, 'folder');
      copyModal.copyToUserFolder(testConfig.testUserName1, sharedFolderTitle);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sharedFolderTitle, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(folderTitle, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should copy a writable folder not owned by current user to a writable folder", function () {
      console.log('folder-permissions copy folders should copy a writable folder not owned by current user to a writable folder');
      // logout current user and login as the user with whom the folder was shared
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // copy source to target folder
      workspacePage.copyResource(sourceFolder, 'folder');
      copyModal.copyToDestination(targetFolder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sourceFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should copy a writable folder not owned by current user to an unwritable folder", function () {
      console.log('folder-permissions copy folders should copy a writable folder not owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName2, true, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);

      workspacePage.copyResource(sourceFolder, 'folder');
      copyModal.copyToDestination(targetFolder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sourceFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should copy an unwritable folder not owned by current user to an unwritable folder", function () {
      console.log('folder-permissions copy folders should copy an unwritable folder not owned by current user to an unwritable folder');
      // create source and target shared folders
      var sourceFolder = workspacePage.createFolder('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch(); // reset search
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch(); // reset search

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // copy source to target folder
      workspacePage.rightClickResource(sourceFolder, 'folder');
      expect(workspacePage.createRightClickCopyToMenuItem().getAttribute('class')).toMatch('link-disabled');
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sourceFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });
  });

  describe('remove created resources', function () {

    it('should delete " + resources.length + " resource from the user workspace', function () {
      console.log('folder permissions should delete  "+ resources.length + " resources should delete resource from the user workspace');
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          console.log("folder-permissions should delete " + resource.title + " for user " + resource.username);
          workspacePage.login(resource.username, resource.password);
          workspacePage.deleteResourceViaRightClick(resource.title, resource.type);
          toastyModal.isSuccess();
          workspacePage.clearSearch();
        })
        (resources[i]);
      }
    });
  });


});


