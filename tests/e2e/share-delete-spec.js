'use strict';
var WorkspacePage = require('../pages/workspace-page.js');
var ToastyModal = require('../modals/toasty-modal.js');
var testConfig = require('../config/test-env.js');
var MoveModal = require('../modals/move-modal.js');
var ShareModal = require('../modals/share-modal.js');
var CopyModal = require('../modals/copy-modal.js');
var SweetAlertModal = require('../modals/sweet-alert-modal.js');
var _ = require('../libs/lodash.min.js');

describe('delete-resource', function () {
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

  // reset user selections to defaults
  it('should be on the workspace', function () {
    console.log('should be on the workspace');
    workspacePage.onWorkspace();
  });

  xdescribe('copy and move', function () {

    it('should create target folders', function () {
      console.log('copy and move should create target folders');

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      target1Folder = workspacePage.createFolder('Target');
      shareModal.shareResource(target1Folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      target1Writable = workspacePage.createFolder('Target');
      shareModal.shareResource(target1Writable, 'folder', testConfig.testUserName2, true, false);
      workspacePage.clearSearch();

      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      target2Folder = workspacePage.createFolder('Target');
      shareModal.shareResource(target2Folder, 'folder', testConfig.testUserName1, false, false);
      workspacePage.clearSearch();
    });

    it("should copy and move resource to folder", function () {
      console.log('copy and move should copy and move resource to folder');

      // create a user 1 resource
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var sourceTemplate = workspacePage.createTemplate('Source');
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
      console.log('copy and move should fail to move and succeed to copy a readable resource');

      // share readable resource with user 1
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Source');
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

      // TODO fail to move to readable resource
      //workspacePage.navigateToUserFolder(testConfig.testUserName2);
      //workspacePage.moveDisabled(sourceTemplate, 'template');

    });

    it("should fail to copy and move to a readable folder", function () {
      console.log('copy and move should fail to copy and move to a readable folder');

      // create a user 2 resource
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Source');
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
      console.log('copy and move should move resource to writable folder');

      // create user 2 resource
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var sourceTemplate = workspacePage.createTemplate('Source');
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

    it("should mark targets as deletable", function () {
      console.log('copy and move should mark targets as deletable');
      resources.push(createResource(target1Folder, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(target1Writable, 'folder', testConfig.testUser1, testConfig.testPassword1));
      resources.push(createResource(target2Folder, 'folder', testConfig.testUser2, testConfig.testPassword2));
    });
  });

  describe('share and delete', function () {

    it("should delete a resource with more options", function () {
      console.log('share and delete should delete a resource with more options');

      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      // delete it
      workspacePage.deleteResource(folder, 'folder');
    });

    it("should delete a resource  with right click", function () {
      console.log('share and delete should delete a resource with right click');

      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      // delete it
      workspacePage.deleteResourceViaRightClick(folder, 'folder');
      toastyModal.isSuccess();
    });

    it("should share and delete a writable resource via user", function () {
      console.log('share and delete should share and delete a writable resource via user');

      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      // give user 1 write access
      shareModal.shareResource(folder, 'folder', testConfig.testUserName1, true, false);
      workspacePage.clearSearch();

      // can user 1 share and delete?
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareAndDeleteEnabled(folder, 'folder');
      workspacePage.clearSearch();

      // user 1 updates sharing and deletes
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();
      workspacePage.deleteResource(folder, 'folder');
    });

    it("should share and delete a writable resource via group", function () {
      console.log('share and delete should share and delete a writable resource via group');

      // create a resource for user 2
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      var folder = workspacePage.createFolder('Writable');

      // give everybody write access
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, true, false);
      workspacePage.clearSearch();

      // can user 1 share and delete?
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareAndDeleteEnabled(folder, 'folder');
      workspacePage.clearSearch();

      // user 1 updates sharing and deletes
      workspacePage.navigateToUserFolder(testConfig.testUserName2);
      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, true, false);
      workspacePage.clearSearch();
      workspacePage.deleteResource(folder, 'folder');
    });

    it("should fail to move, share, and delete a readable resource", function () {
      console.log('share and delete should fail to share and delete a readable resource');

      // create a resource for user 1
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      // give read access to user 2
      shareModal.shareResource(folder, 'folder', testConfig.testUserName2, false, false);
      workspacePage.clearSearch();

      // user 2 should not be able to share or delete
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.moveShareDeleteDisabled(folder, 'folder');
    });

    it("should fail to moe, share, and delete a readable resource via group", function () {
      console.log('share and delete should fail to share and delete a readable resource via group');

      // create a resource for user 1
      workspacePage.login(testConfig.testUser1, testConfig.testPassword1);
      var folder = workspacePage.createFolder('Readable');
      resources.push(createResource(folder, 'folder', testConfig.testUser1, testConfig.testPassword1));

      // give read access to everybody
      shareModal.shareResourceWithGroup(folder, 'folder', testConfig.everybodyGroup, false, false);
      workspacePage.clearSearch();

      // user 2 should not be able to share or delete
      workspacePage.login(testConfig.testUser2, testConfig.testPassword2);
      workspacePage.navigateToUserFolder(testConfig.testUserName1);
      shareModal.moveShareDeleteDisabled(folder, 'folder');
    });

  });

  describe('remove created resources', function () {

    it('should delete resource from the user workspace', function () {
      console.log('share and delete should delete ' + resources.length + ' resources from the user workspace');
      for (var i = 0; i < resources.length; i++) {
        (function (resource) {
          console.log("copy and move, share and delete should delete " + resource.title + " for user " + resource.username);
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


