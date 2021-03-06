'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

describe('copy and move', function () {
  var EC = protractor.ExpectedConditions;
  var workspacePage = WorkspacePage;
  var toastyModal = ToastyModal;
  var moveModal = MoveModal;
  var shareModal = ShareModal;
  var copyModal = CopyModal;
  var sweetAlertModal = SweetAlertModal;

  var target1Folder;
  var target2Folder;
  var target1Writable;

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

  it('should be on the workspace', function () {
    console.log('resource-permissions should be on the workspace');
    workspacePage.onWorkspace();
  });

  it('should create target folders', function () {
    console.log('resource-permissions should create target folders');

    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    target1Folder = workspacePage.createFolder('Trgt');
    shareModal.shareResource(target1Folder, 'folder', testConfig.testUserName2, false, false);
    workspacePage.clearSearch();

    workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
    target1Writable = workspacePage.createFolder('Trgt');
    shareModal.shareResource(target1Writable, 'folder', testConfig.testUserName2, true, false);
    workspacePage.clearSearch();

    workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
    target2Folder = workspacePage.createFolder('Trgt');
    shareModal.shareResource(target2Folder, 'folder', testConfig.testUserName1, false, false);
    workspacePage.clearSearch();
  });

  describe('copy and move tests', function () {

    it("should copy and move resource to folder", function () {
      console.log('resource-permissions should copy and move resource to folder');

      // create a user 1 resource
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var sourceTemplate = workspacePage.createTemplate('Src');
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));

      // copy resource to user 1 target
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(target1Folder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));

      // move resource to user 1 target
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToDestination(target1Folder);
      toastyModal.isSuccess();
      workspacePage.clearSearch();
    });

    it("should fail to move and succeed to copy a readable resource", function () {
      console.log('resource-permissions should fail to move and succeed to copy a readable resource');

      // share readable resource with user 1
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Src');
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName1, false, false);
      workspacePage.clearSearch();

      // succeed to copy readable resource
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, target1Writable);
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      toastyModal.isSuccess();
      workspacePage.clearSearch();

      // fail to move to readable resource
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.moveShareDeleteDisabled(sourceTemplate, 'template');

    });

    it("should fail to copy and move to a readable folder", function () {
      console.log('resource-permissions should fail to copy and move to a readable folder');

      // create a user 2 resource
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Src');
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));

      // cannot copy resource to user 1's readable folder
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, target1Folder);
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();

      // cannot move resource to user 1's readable folder
      workspacePage.moveResource(sourceTemplate, 'template');
      moveModal.moveToUserFolder(testConfig.testUserName1, target1Folder);
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();
      workspacePage.clearSearch();
    });


    it("should move resource to a writable folder", function () {
      console.log('resource-permissions should move resource to writable folder');

      // create user 2 resource
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Src');
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      // copy resource to user 1 writable target
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(target1Writable);
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      toastyModal.isSuccess();
      workspacePage.clearSearch();

    });
  });

  xdescribe('copy tests', function () {

    it("should copy a resource owned by current user to a writable folder", function () {
      console.log('resource-permissions should copy a resource owned by current user to a writable folder');
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);

      // create template and target folder
      var sourceTemplate = workspacePage.createTemplate('Src');
      var targetFolder = workspacePage.createFolder('Trgt');

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
      var sourceTemplate = workspacePage.createTemplate('Src');

      // copy created template to shared folder
      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToUserFolder(testConfig.testUserName1, sharedFolderTitle);
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();

      // delete these at the end
      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(sharedFolderTitle, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should copy a writable resource not owned by current user to a writable folder", function () {
      console.log('resource-permissions should copy a writable resource not owned by current user to a writable folder');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source template and target shared folder
      var sourceTemplate = workspacePage.createTemplate('Src');
      var targetFolder = workspacePage.createFolder('Trgt');

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
      var sourceTemplate = workspacePage.createTemplate('Src');
      var targetFolder = workspacePage.createFolder('Trgt');

      shareModal.shareResource(sourceTemplate, 'template', testConfig.testUserName2, true, false);
      workspacePage.clearSearch();
      shareModal.shareResource(targetFolder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      workspacePage.navigateToUserFolder(testConfig.testUserName1);

      workspacePage.copyResource(sourceTemplate, 'template');
      copyModal.copyToDestination(targetFolder);
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();

      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    });

    it("should copy an unwritable resource not owned by current user to an unwritable folder", function () {
      console.log('resource-permissions should copy an unwritable resource not owned by current user to an unwritable folder');
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);

      // create source template and target shared folder
      var sourceTemplate = workspacePage.createTemplate('Src');
      var targetFolder = workspacePage.createFolder('Trgt');

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
      sweetAlertModal.noWriteAccess();
      sweetAlertModal.confirm();

      resources.push(createResource(sourceTemplate, 'template', testConfig.testUser2, testConfig.testPassword2));
      resources.push(createResource(targetFolder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });
  });

  it("should mark targets as deletable", function () {
    console.log('resource-permissions should mark targets as deletable');
    resources.push(createResource(target1Folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
    resources.push(createResource(target1Writable, 'folder', testConfig.testUser1, testConfig.testPassword1));
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


