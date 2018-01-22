'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

describe('resource-permissions', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var shareModal = ShareModal;
  var copyModal = CopyModal;
  var sweetAlertModal = SweetAlertModal;

  var target1Folder;
  var target2Folder;

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
    console.log('resource-permissions should be on the workspace');
    workspacePage.onWorkspace();
  });

  // reset user selections to defaults
  it('should create target folders', function () {
    console.log('resource-permissions should create target folders');
    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    target1Folder = workspacePage.createFolder('Target');

    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    target2Folder = workspacePage.createFolder('Target');
  });

  describe('move tests', function () {

    // TODO fails on staging
    xit("should move a resource owned by current user to a writable folder", function () {
      console.log('resource-permissions should move a resource owned by current user to a writable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create template and target folder
      var sourceTemplate = workspacePage.createTemplate('Source');

      // copy source to target folder
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(target1Folder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      // move source to target folder
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToDestination(target1Folder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      // delete these at the end
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    // TODO fails on staging
    xit("should move a resource owned by current user to an unwritable folder", function () {
      console.log('resource-permissions should move a resource owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // share folder with user 2, read only
      shareModal.shareResource(target1Folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      // logout current user and login as user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create a template to move to the shared folder
      var sourceTemplate = workspacePage.createTemplate('Source');

      // copy created template to user 1's shared folder
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, target1Folder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      // move created template to user 1's shared folder
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToUserFolder(testConfig.testUserName1, target1Folder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
    });

    // TODO fails on staging
    xit("should move a writable resource not owned by current user to a writable folder", function () {
      console.log('resource-permissions should move a writable resource not owned by current user to a writable folder');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source template and target shared folder
      var sourceTemplate = workspacePage.createTemplate('Source');

      // share the template and folder as writable
      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      shareModal.shareResource(target2Folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // move source to target folder
      //workspacePage.moveResource(sourceTemplate, 'template');
      workspacePage.moveResourceViaRightClick(sourceTemplate, 'template');
      moveModal.moveToDestination(target2Folder);
      toastyModal.isSuccess();

      // delete these at the end
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    // TODO fails on staging
    xit("should move a writable resource not owned by current user to an unwritable folder", function () {
      console.log('resource-permissions should move a writable resource not owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source template and target shared folder
      var sourceTemplate = workspacePage.createTemplate('Source');

      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName2, true, false);
      workspacePage.clearSearch();
      shareModal.shareResource(target1Folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);

      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(target1Folder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToDestination(target1Folder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
    });

    // TODO failing travis
    xit("should move an unwritable resource not owned by current user to an unwritable folder", function () {
      console.log('resource-permissions should move an unwritable resource not owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source template and target shared folder
      var sourceTemplate = workspacePage.createTemplate('Source');

      // share both folders
      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName1, false, false);
      workspacePage.clearSearch();
      shareModal.shareResource(target2Folder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      moveModal.moveDisabledViaRightClick(sourceTemplate, 'template');

      // delete these at the end
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
    });
  });

  xdescribe('copy tests', function () {

    it("should copy a resource owned by current user to a writable folder", function () {
      console.log('resource-permissions should copy a resource owned by current user to a writable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create template and target folder
      var sourceTemplate = workspacePage.createTemplate('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // copy template to target folder
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(targetFolder);
      toastyModal.isSuccess();

      // delete these at the end
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should copy a resource owned by current user to an unwritable folder", function () {
      console.log('resource-permissions should copy a resource owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create a folder to share with another user
      var sharedFolderTitle = workspacePage.createFolder('Shared');

      // share folder
      shareModal.shareResource(sharedFolderTitle, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      // logout current user and login as the user with whom the folder was shared
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create a template to copy to the shared folder
      var sourceTemplate = workspacePage.createTemplate('Source');

      // copy created template to shared folder
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, sharedFolderTitle);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();

      // delete these at the end
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(sharedFolderTitle, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should copy a writable resource not owned by current user to a writable folder", function () {
      console.log('resource-permissions should copy a writable resource not owned by current user to a writable folder');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source template and target shared folder
      var sourceTemplate = workspacePage.createTemplate('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share the template and folder
      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      // copy source to target folder
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(targetFolder);
      toastyModal.isSuccess();

      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });

    it("should copy a writable resource not owned by current user to an unwritable folder", function () {
      console.log('resource-permissions should copy a writable resource not owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create source template and target shared folder
      var sourceTemplate = workspacePage.createTemplate('Source');
      var targetFolder = workspacePage.createFolder('Target');

      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName2, true, false);
      workspacePage.clearSearch();
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);

      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(targetFolder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();

      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should copy an unwritable resource not owned by current user to an unwritable folder", function () {
      console.log('resource-permissions should copy an unwritable resource not owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source template and target shared folder
      var sourceTemplate = workspacePage.createTemplate('Source');
      var targetFolder = workspacePage.createFolder('Target');

      // share both folders
      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName1, false, false);
      workspacePage.clearSearch();
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // go to Test User 2's folder to see the shared folders
      workspacePage.navigateToUserFolder(testConfig.testUserName2);

      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(targetFolder);
      sweetAlertModal.hasInsufficientPermissions();
      sweetAlertModal.confirm();

      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });
  });

  it("should mark targets as deletable", function () {
    console.log('resource-permissions should mark targets as deletable');
    resources.push(createResource(target1Folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    resources.push(createResource(target2Folder, 'folder', testConfig.testUser2, testConfig.testPassword2));
  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      console.log('should delete ' + resources.length + ' resource from the user workspace');
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          console.log("resource-permissions should delete " + resource.title + " for user " + resource.username);
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


